from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import JSONResponse, FileResponse
import boto3
from botocore.exceptions import ClientError
import os
from datetime import datetime, timedelta
import json
import base64
from typing import Optional
import hashlib

router = APIRouter()

# Initialize AWS clients for LocalStack
def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url=os.getenv('LOCALSTACK_URL', 'http://localstack:4566'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID', 'test'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY', 'test'),
        region_name=os.getenv('AWS_REGION', 'us-east-1')
    )

def get_lambda_client():
    return boto3.client(
        'lambda',
        endpoint_url=os.getenv('LOCALSTACK_URL', 'http://localstack:4566'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID', 'test'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY', 'test'),
        region_name=os.getenv('AWS_REGION', 'us-east-1')
    )

@router.get("/list")
async def list_reports(include_internal: bool = Query(False)):
    """List available reports"""

    reports = [
        {
            "id": "soc2-2024",
            "title": "SOC 2 Type II Report",
            "type": "compliance",
            "date": "2024-01-15",
            "public": True,
            "bucket": "dvtc-public-reports",
            "file": "soc2-report-2024.txt"
        },
        {
            "id": "iso27001-gap",
            "title": "ISO 27001 Gap Analysis",
            "type": "assessment",
            "date": "2024-03-01",
            "public": False,
            "bucket": "dvtc-internal-reports",
            "file": "iso27001-gap-analysis.pdf"
        },
        {
            "id": "pentest-2023",
            "title": "Penetration Test Report",
            "type": "security",
            "date": "2023-01-01",
            "public": False,
            "bucket": "dvtc-internal-reports",
            "file": "pentest-draft-do-not-share.txt",
            "warning": "Contains critical findings"
        },
        {
            "id": "customer-attestation",
            "title": "Customer Security Attestation",
            "type": "attestation",
            "date": "2024-11-01",
            "public": True,
            "bucket": "dvtc-public-reports",
            "file": "customer-attestation.pdf"
        }
    ]

    # VULNERABILITY: Include internal reports with parameter
    if include_internal:
        reports.extend([
            {
                "id": "incident-response",
                "title": "Q3 Security Incidents",
                "type": "incident",
                "date": "2024-09-30",
                "public": False,
                "bucket": "dvtc-internal-reports",
                "file": "incidents-q3-2024.json",
                "severity": "high",
                "incidents_count": 3
            },
            {
                "id": "api-keys-audit",
                "title": "API Keys Audit Report",
                "type": "audit",
                "date": "2024-10-15",
                "public": False,
                "bucket": "dvtc-internal-reports",
                "file": "api-keys-audit.csv",
                "finding": "Multiple non-rotated keys found"
            }
        ])

    return {
        "reports": reports,
        "total": len(reports),
        "public_count": sum(1 for r in reports if r.get("public", False)),
        "categories": list(set(r["type"] for r in reports)),
        "hint": "Need a download link? Try /api/reports/presigned?file=FILENAME&expiry=SECONDS",
        "note": "Default expiry is 3600 seconds (1 hour), but longer expiries are supported"
    }

@router.get("/presigned")
async def get_presigned_url(
    file: str = Query(..., description="File to generate presigned URL for"),
    expiry: int = Query(3600, description="URL expiry in seconds")
):
    """Generate presigned URL for report download (VULNERABILITY: Long expiry)"""

    s3_client = get_s3_client()

    # Determine bucket based on file
    bucket = "dvtc-public-reports"  # Default to public
    if "internal" in file or "draft" in file:
        bucket = "dvtc-internal-reports"

    # VULNERABILITY: Allow very long expiry times
    max_expiry = 604800  # 7 days
    if expiry > max_expiry:
        expiry = max_expiry  # Cap at 7 days but still very long

    try:
        # Generate presigned URL
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket, 'Key': file},
            ExpiresIn=expiry
        )

        # VULNERABILITY: Log sensitive information
        print(f"Generated presigned URL for {bucket}/{file} with {expiry}s expiry")

        response = {
            "url": presigned_url,
            "bucket": bucket,
            "file": file,
            "expires_in": expiry,
            "expires_at": (datetime.now() + timedelta(seconds=expiry)).isoformat()
        }

        # VULNERABILITY: Include flag for long-lived URLs
        if expiry >= 86400:  # 1 day or more
            response["warning"] = "Long-lived presigned URL generated"
            response["flag"] = "flag{presigned_url_forever}"

        return response

    except ClientError as e:
        # VULNERABILITY: Detailed error messages
        raise HTTPException(
            status_code=404,
            detail=f"File not found: {bucket}/{file} - {str(e)}"
        )

@router.post("/generate")
async def generate_report(
    template: str = Query("default", description="Report template"),
    format: str = Query("pdf", description="Output format"),
    customer_id: str = Query(None, description="Customer ID"),
    debug: bool = Query(False, description="Enable debug mode")
):
    """Generate report (VULNERABILITY: Template injection + path traversal)"""

    # VULNERABILITY: Path traversal in template loading
    if '../' in template or '..\\' in template:
        # FLAG03: Template traversal detected
        return {
            "report": "Attempted to access restricted file",
            "flag": "flag{template_traversal}",
            "message": "PATH TRAVERSAL DETECTED! Lambda would have allowed file access.",
            "vulnerable_template": template,
            "warning": "In a real scenario, this could read /etc/passwd or other sensitive files"
        }

    # VULNERABILITY: Custom template injection
    if template == "custom":
        return {
            "report": "Custom template feature available",
            "hint": "Try using path traversal with '../' in the template parameter",
            "examples": [
                "?template=../etc/passwd",
                "?template=../../secrets/api-keys.txt"
            ]
        }

    # Generate default report
    from datetime import datetime, timedelta
    report_data = {
        'title': 'Security Compliance Report',
        'customer_id': customer_id or "anonymous",
        'generated_at': datetime.now().isoformat(),
        'compliance_status': {
            'soc2': 'PASSED',
            'iso27001': 'IN_PROGRESS',
            'hipaa': 'NOT_STARTED',
            'gdpr': 'PASSED'
        },
        'vulnerabilities_found': 0,
        'last_scan': (datetime.now() - timedelta(days=7)).isoformat(),
        'next_audit': (datetime.now() + timedelta(days=30)).isoformat()
    }

    # VULNERABILITY: Information disclosure in debug mode
    if debug:
        report_data['debug_info'] = {
            'lambda_arn': 'arn:aws:lambda:us-east-1:000000000000:function:generate_report',
            'environment': {
                'STAGE': 'production',
                'DEBUG': 'true',
                'SECRET_MANAGER_ENABLED': 'true'
            },
            'secrets_manager_hint': 'Try accessing /api/admin/secrets',
            'iam_role': 'arn:aws:iam::000000000000:role/dvtc-trustcenter-role',
            'template_injection_hint': 'Try template=../etc/passwd for path traversal'
        }

    return report_data

@router.get("/download/{report_id}")
async def download_report(report_id: str, token: Optional[str] = Query(None)):
    """Download report directly (VULNERABILITY: Weak token check)"""

    # Map report IDs to files
    report_map = {
        "soc2-2024": ("dvtc-public-reports", "soc2-report-2024.txt"),
        "pentest-2023": ("dvtc-internal-reports", "pentest-draft-do-not-share.txt"),
        "customer-attestation": ("dvtc-public-reports", "customer-attestation.pdf"),
        "audit-trail": ("dvtc-internal-reports", "audit-trail.json")
    }

    if report_id not in report_map:
        # VULNERABILITY: Reveal valid report IDs
        raise HTTPException(
            status_code=404,
            detail=f"Report not found. Valid IDs: {list(report_map.keys())}"
        )

    bucket, key = report_map[report_id]

    # VULNERABILITY: Weak token validation for internal reports
    if "internal" in bucket:
        if token != "internal_report_token_2024":
            # But still allow download with specific user agent
            pass  # No actual check, just logging

    s3_client = get_s3_client()

    try:
        # Get object from S3
        response = s3_client.get_object(Bucket=bucket, Key=key)
        content = response['Body'].read()

        # Return file content
        return JSONResponse(
            content={
                "report_id": report_id,
                "content": content.decode('utf-8') if key.endswith('.txt') or key.endswith('.json') else base64.b64encode(content).decode('utf-8'),
                "bucket": bucket,
                "file": key,
                "size": len(content),
                "content_type": response.get('ContentType', 'application/octet-stream')
            },
            headers={
                "X-Report-Source": f"s3://{bucket}/{key}",
                "X-Report-Classification": "INTERNAL" if "internal" in bucket else "PUBLIC"
            }
        )

    except ClientError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Failed to download report: {str(e)}"
        )

@router.post("/upload")
async def upload_report(
    filename: str,
    content: str,
    bucket: str = Query("dvtc-public-reports"),
    public: bool = Query(False),
    override_token: Optional[str] = Query(None)
):
    """Upload a new report (VULNERABILITY: Weak authorization)"""

    # VULNERABILITY: Bypass with token
    if override_token != "upload_override_2024":
        raise HTTPException(status_code=403, detail="Upload not authorized")

    s3_client = get_s3_client()

    # Decode content if base64
    try:
        file_content = base64.b64decode(content)
    except:
        file_content = content.encode('utf-8')

    # VULNERABILITY: No file type validation
    try:
        # Upload to S3
        s3_client.put_object(
            Bucket=bucket,
            Key=filename,
            Body=file_content,
            ACL='public-read' if public else 'private'
        )

        return {
            "success": True,
            "bucket": bucket,
            "filename": filename,
            "size": len(file_content),
            "public": public,
            "url": f"https://{bucket}.s3.amazonaws.com/{filename}" if public else None
        }

    except ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )

@router.get("/analytics")
async def get_report_analytics():
    """Get report download analytics (VULNERABILITY: Exposes usage data)"""

    # Fake analytics data
    analytics = {
        "period": {
            "start": (datetime.now() - timedelta(days=30)).isoformat(),
            "end": datetime.now().isoformat()
        },
        "downloads": {
            "total": 1337,
            "unique_users": 142,
            "by_report": {
                "soc2-2024": 567,
                "customer-attestation": 423,
                "pentest-2023": 234,  # VULNERABILITY: Internal report downloads tracked
                "audit-trail": 89,
                "api-keys-audit": 24
            },
            "by_day": [random.randint(20, 80) for _ in range(30)]
        },
        "top_users": [
            {"email": "john@techcorp.com", "downloads": 45},
            {"email": "security@auditfirm.com", "downloads": 38},
            {"email": "admin@dvtc.local", "downloads": 127}  # VULNERABILITY: Admin activity exposed
        ],
        "presigned_urls": {
            "generated": 234,
            "average_expiry": "3 days",
            "longest_expiry": "7 days",
            "active_urls": 45
        },
        "storage": {
            "total_size": "4.2 GB",
            "report_count": 127,
            "buckets": [
                {"name": "dvtc-public-reports", "size": "1.3 GB", "object_count": 45},
                {"name": "dvtc-internal-reports", "size": "2.9 GB", "object_count": 82}
            ]
        }
    }

    return analytics

@router.get("/deleted")
async def list_deleted_files(bucket: str = Query("dvtc-internal-reports", description="S3 bucket name")):
    """List deleted files using S3 versioning (VULNERABILITY: Exposes deleted content!)"""

    s3_client = get_s3_client()

    try:
        # VULNERABILITY: List all versions including deleted files
        response = s3_client.list_object_versions(Bucket=bucket)

        deleted_files = []

        # Find delete markers (deleted files)
        for marker in response.get('DeleteMarkers', []):
            deleted_files.append({
                "key": marker['Key'],
                "version_id": marker['VersionId'],
                "last_modified": marker['LastModified'].isoformat(),
                "is_latest": marker.get('IsLatest', False),
                "status": "deleted"
            })

        # Also list previous versions (files that were deleted but have versions)
        for version in response.get('Versions', []):
            if not version.get('IsLatest', True):
                deleted_files.append({
                    "key": version['Key'],
                    "version_id": version['VersionId'],
                    "last_modified": version['LastModified'].isoformat(),
                    "size": version.get('Size', 0),
                    "status": "previous_version"
                })

        return {
            "bucket": bucket,
            "deleted_files": deleted_files,
            "total": len(deleted_files),
            "warning": "VULNERABILITY: S3 versioning exposes deleted files!",
            "hint": "Use /api/reports/deleted/{key} to recover deleted files"
        }

    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Failed to list deleted files: {str(e)}")

@router.get("/deleted/{file_key:path}")
async def recover_deleted_file(
    file_key: str,
    bucket: str = Query("dvtc-internal-reports", description="S3 bucket name"),
    version_id: str = Query(None, description="Specific version ID to recover")
):
    """Recover a deleted file from S3 versioning (VULNERABILITY: Anyone can access!)"""

    s3_client = get_s3_client()

    try:
        # VULNERABILITY: No authentication - anyone can recover deleted files
        params = {'Bucket': bucket, 'Key': file_key}
        if version_id:
            params['VersionId'] = version_id
        else:
            # Get the latest version (even if deleted)
            versions = s3_client.list_object_versions(Bucket=bucket, Prefix=file_key)
            if versions.get('Versions'):
                params['VersionId'] = versions['Versions'][0]['VersionId']

        response = s3_client.get_object(**params)
        content = response['Body'].read()

        # FLAG09: Detect flag in deleted files
        content_str = content.decode('utf-8', errors='ignore')
        flag = None
        if 'flag{' in content_str:
            import re
            flag_match = re.search(r'flag\{[^}]+\}', content_str)
            if flag_match:
                flag = flag_match.group(0)

        return {
            "bucket": bucket,
            "key": file_key,
            "version_id": params.get('VersionId'),
            "content": content_str,
            "size": len(content),
            "flag": flag,
            "message": "FLAG09: Deleted files recovered from S3 versioning!" if flag else None,
            "warning": "VULNERABILITY: S3 versioning retains deleted files indefinitely!"
        }

    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            raise HTTPException(status_code=404, detail=f"File '{file_key}' not found in bucket")
        raise HTTPException(status_code=500, detail=f"Failed to recover file: {str(e)}")

import random  # Add this import at the top of the file