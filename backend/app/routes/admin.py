from fastapi import APIRouter, HTTPException, Header, Query, Depends, Body
from fastapi.responses import JSONResponse, FileResponse
from typing import Optional, Dict, Any
import json
import os
from datetime import datetime, timedelta
import hashlib
import base64
import boto3
from botocore.exceptions import ClientError

router = APIRouter()

# Initialize Secrets Manager client for LocalStack
def get_secrets_client():
    return boto3.client(
        'secretsmanager',
        endpoint_url=os.getenv('LOCALSTACK_URL', 'http://localstack:4566'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID', 'test'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY', 'test'),
        region_name=os.getenv('AWS_REGION', 'us-east-1')
    )

# VULNERABILITY: Weak admin credentials
ADMIN_USERS = {
    "admin": "admin123",
    "root": "toor",
    "administrator": "password",
    "dvtc_admin": "dvtc2024"
}

# Mock session storage (VULNERABILITY: Predictable session tokens)
SESSIONS = {}

def verify_admin(authorization: Optional[str] = Header(None)):
    """VULNERABILITY: Weak authentication check"""
    if not authorization:
        # VULNERABILITY: Auth bypass with specific user-agent
        return {"username": "guest", "role": "viewer"}

    # VULNERABILITY: Basic auth with weak passwords
    if authorization.startswith("Basic "):
        try:
            decoded = base64.b64decode(authorization[6:]).decode()
            username, password = decoded.split(":", 1)
            if username in ADMIN_USERS and ADMIN_USERS[username] == password:
                return {"username": username, "role": "admin"}
        except:
            pass

    # VULNERABILITY: Predictable session tokens
    if authorization.startswith("Bearer "):
        token = authorization[7:]
        if token in SESSIONS:
            return SESSIONS[token]
        # VULNERABILITY: Magic token bypass
        if token == "admin_override_token_2024":
            return {"username": "system", "role": "superadmin"}

    return None

@router.post("/login")
async def admin_login(username: str = Body(...), password: str = Body(...)):
    """Admin login endpoint"""

    # VULNERABILITY: Timing attack possible
    if username not in ADMIN_USERS:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if ADMIN_USERS[username] != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # VULNERABILITY: Weak session token generation
    session_token = hashlib.md5(f"{username}:{datetime.now().isoformat()}".encode()).hexdigest()

    SESSIONS[session_token] = {
        "username": username,
        "role": "admin",
        "login_time": datetime.now().isoformat()
    }

    return {
        "token": session_token,
        "username": username,
        "role": "admin",
        "expires_in": 3600
    }

@router.get("/dashboard")
async def admin_dashboard(user: Dict = Depends(verify_admin)):
    """Admin dashboard with sensitive information"""

    # VULNERABILITY: No proper authorization check
    return {
        "user": user,
        "stats": {
            "total_users": 1337,
            "active_sessions": len(SESSIONS),
            "failed_logins": 42,
            "suspicious_activities": 7
        },
        "system_info": {
            "version": "1.0.0-vulnerable",
            "uptime": "30 days",
            "last_backup": (datetime.now() - timedelta(days=7)).isoformat(),
            "database_size": "4.2GB"
        },
        "recent_events": [
            {
                "timestamp": datetime.now().isoformat(),
                "event": "Flag accessed",
                "user": "anonymous",
                "details": "Someone found flag{who_needs_auth}"
            },
            {
                "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
                "event": "Admin login",
                "user": "admin",
                "ip": "192.168.1.100"
            }
        ],
        "sensitive_config": {
            "aws_region": os.getenv("AWS_REGION", "us-east-1"),
            "localstack_url": os.getenv("LOCALSTACK_URL", "http://localstack:4566"),
            "debug_mode": os.getenv("DEBUG", "true")
        }
    }

@router.get("/users")
async def list_users(user: Dict = Depends(verify_admin)):
    """List all users (VULNERABILITY: Exposes user data)"""

    users = [
        {
            "id": 1,
            "username": "admin",
            "email": "admin@dvtc.local",
            "role": "admin",
            "last_login": datetime.now().isoformat(),
            "mfa_enabled": False,
            "api_key": "sk_admin_xxxxx"
        },
        {
            "id": 2,
            "username": "john.doe",
            "email": "john.doe@techcorp.com",
            "role": "user",
            "last_login": (datetime.now() - timedelta(days=1)).isoformat(),
            "mfa_enabled": True,
            "api_key": "sk_user_yyyyy"
        },
        {
            "id": 3,
            "username": "security_scanner",
            "email": "scanner@security.local",
            "role": "service_account",
            "last_login": None,
            "mfa_enabled": False,
            "api_key": "sk_service_zzzzz",
            "notes": "DO NOT DISABLE - Required for compliance scanning"
        }
    ]

    return {"users": users, "total": len(users)}

@router.get("/logs")
async def get_audit_logs(
    user: Dict = Depends(verify_admin),
    limit: int = Query(100, description="Number of logs to return")
):
    """Get audit logs (VULNERABILITY: No filtering of sensitive data)"""

    logs = []
    for i in range(min(limit, 100)):
        logs.append({
            "timestamp": (datetime.now() - timedelta(minutes=i*5)).isoformat(),
            "level": ["INFO", "WARNING", "ERROR", "CRITICAL"][i % 4],
            "source": ["api", "auth", "database", "lambda"][i % 4],
            "message": [
                "User authenticated successfully",
                "Failed login attempt for admin",
                "Database backup completed",
                f"Secret accessed: okta_api_token",
                "Lambda function invoked without auth",
                f"Flag discovered: flag{{admin_trail_for_all}}",
                "Presigned URL generated with 7-day expiry",
                "IAM role assumed: dvtc-admin-role"
            ][i % 8],
            "details": {
                "ip": f"192.168.1.{100 + i % 50}",
                "user_agent": "Mozilla/5.0",
                "request_id": hashlib.md5(str(i).encode()).hexdigest()
            }
        })

    return {
        "logs": logs,
        "total": len(logs),
        "export_url": "/api/admin/logs/export",
        "retention_days": 90
    }

@router.get("/config")
async def get_system_config(user: Dict = Depends(verify_admin)):
    """Get system configuration (VULNERABILITY: Exposes sensitive config)"""

    return {
        "database": {
            "host": "db.dvtc.internal",
            "port": 5432,
            "name": "trustcenter",
            "user": "postgres",
            "password": "postgres123",  # VULNERABILITY: Password in response
            "ssl_enabled": False
        },
        "aws": {
            "region": "us-east-1",
            "access_key_id": os.getenv("AWS_ACCESS_KEY_ID", "AKIAIOSFODNN7EXAMPLE"),
            "secret_access_key": "****" + os.getenv("AWS_SECRET_ACCESS_KEY", "")[-4:],  # Partial leak
            "localstack_url": os.getenv("LOCALSTACK_URL")
        },
        "features": {
            "debug_mode": True,
            "rate_limiting": False,
            "audit_logging": True,
            "encryption_at_rest": False,
            "mfa_required": False
        },
        "endpoints": {
            "internal_api": "http://internal-api.dvtc.local:8080",
            "metrics": "http://metrics.dvtc.local:9090",
            "logging": "http://elk.dvtc.local:5601"
        }
    }

@router.post("/force-compliance")
async def force_compliance(
    framework: str,
    status: str,
    token: Optional[str] = Query(None),
    user: Dict = Depends(verify_admin)
):
    """Force compliance status (VULNERABILITY: Can be accessed with token)"""

    # VULNERABILITY: Bypass auth with special token
    if token == "compliance_override_2024":
        return {
            "success": True,
            "framework": framework,
            "new_status": status,
            "override_by": "system",
            "flag": "flag{compliance_by_css}"
        }

    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return {
        "success": True,
        "framework": framework,
        "new_status": status,
        "override_by": user.get("username")
    }

@router.get("/downloadAuditTrail")
async def download_audit_trail():
    """Download audit trail (VULNERABILITY: No authentication!)"""

    # This endpoint intentionally has no auth check
    # It's supposed to be protected by API Gateway but isn't

    audit_data = {
        "export_date": datetime.now().isoformat(),
        "export_format": "json",
        "period": {
            "start": (datetime.now() - timedelta(days=30)).isoformat(),
            "end": datetime.now().isoformat()
        },
        "events": [
            {
                "timestamp": datetime.now().isoformat(),
                "event_type": "ADMIN_ACCESS",
                "user": "admin@dvtc.local",
                "action": "VIEW_ALL_SECRETS",
                "result": "SUCCESS",
                "details": {
                    "secrets_accessed": [
                        "okta_api_token",
                        "admin_api_key",
                        "jwt_signing_key"
                    ]
                }
            },
            {
                "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
                "event_type": "FLAG_DISCOVERED",
                "user": "anonymous",
                "action": "ACCESS_FLAG",
                "result": "SUCCESS",
                "details": {
                    "flag": "flag{who_needs_auth}",
                    "endpoint": "/api/admin/downloadAuditTrail"
                }
            },
            {
                "timestamp": (datetime.now() - timedelta(hours=4)).isoformat(),
                "event_type": "SECURITY_SCAN",
                "user": "security_scanner",
                "action": "VULNERABILITY_SCAN",
                "result": "COMPLETED",
                "details": {
                    "vulnerabilities_found": 15,
                    "critical": 5,
                    "high": 7,
                    "medium": 3
                }
            }
        ],
        "statistics": {
            "total_events": 127,
            "successful_logins": 89,
            "failed_logins": 38,
            "admin_actions": 45,
            "suspicious_activities": 12
        }
    }

    return JSONResponse(
        content=audit_data,
        headers={
            "Content-Disposition": "attachment; filename=audit_trail.json",
            "X-No-Auth-Required": "true",  # VULNERABILITY: Header reveals no auth
            "X-Flag": "flag{who_needs_auth}"
        }
    )

@router.get("/backup")
async def download_backup(user: Dict = Depends(verify_admin)):
    """Download system backup (VULNERABILITY: Contains sensitive data)"""

    backup_data = {
        "backup_date": datetime.now().isoformat(),
        "version": "1.0.0",
        "data": {
            "users": list(ADMIN_USERS.keys()),
            "passwords": ADMIN_USERS,  # VULNERABILITY: Passwords in backup
            "sessions": list(SESSIONS.keys()),
            "flags": [
                "flag{who_needs_auth}",
                "flag{admin_trail_for_all}",
                "flag{compliance_by_css}"
            ],
            "config": {
                "jwt_secret": "123456",
                "api_keys": ["sk_admin_xxxxx", "sk_user_yyyyy"],
                "webhook_secrets": ["wh_sec_123456"]
            }
        }
    }

    return backup_data

@router.get("/session")
async def get_session_info(x_admin_token: Optional[str] = Header(None)):
    """Get session information (VULNERABILITY: Weak token validation)"""

    # VULNERABILITY: FLAG12 - Weak session token validation
    if x_admin_token == "admin_override_token_2024":
        return {
            "authenticated": True,
            "role": "superadmin",
            "username": "system",
            "flag": "flag{md5_sessions_bad}",
            "message": "Weak session token accepted!",
            "hint": "MD5-based sessions are insecure"
        }

    # Check regular sessions
    if x_admin_token and x_admin_token in SESSIONS:
        session_data = SESSIONS[x_admin_token]
        return {
            "authenticated": True,
            "username": session_data["username"],
            "role": session_data["role"],
            "login_time": session_data["login_time"]
        }

    return {"authenticated": False, "message": "Invalid or missing session token"}

@router.post("/validate-token")
async def validate_admin_token(token: str):
    """Validate admin token (VULNERABILITY: Predictable tokens)"""

    # VULNERABILITY: FLAG12 - Another endpoint for weak tokens
    if token == "admin_override_token_2024":
        return {
            "valid": True,
            "flag": "flag{md5_sessions_bad}",
            "token_type": "magic_token",
            "permissions": ["all"]
        }

    # VULNERABILITY: MD5 token pattern
    import re
    if re.match(r'^[a-f0-9]{32}$', token):
        # Looks like MD5, probably valid
        return {
            "valid": True,
            "token_type": "md5_session",
            "warning": "MD5 tokens are cryptographically weak"
        }

    return {"valid": False, "message": "Invalid token format"}

@router.get("/secrets")
async def list_secrets():
    """List all secrets in Secrets Manager (VULNERABILITY: No authentication!)"""

    # VULNERABILITY: This endpoint has no auth check - anyone can list secrets
    secrets_client = get_secrets_client()

    try:
        response = secrets_client.list_secrets()

        secret_list = []
        for secret in response.get('SecretList', []):
            secret_list.append({
                "name": secret['Name'],
                "arn": secret['ARN'],
                "description": secret.get('Description', ''),
                "created_date": secret.get('CreatedDate').isoformat() if secret.get('CreatedDate') else None,
                "last_accessed": secret.get('LastAccessedDate').isoformat() if secret.get('LastAccessedDate') else None,
                "tags": secret.get('Tags', [])
            })

        return {
            "secrets": secret_list,
            "total": len(secret_list),
            "warning": "This endpoint exposes all secret names!",
            "hint": "Try /api/admin/secrets/<secret_name> to read a specific secret"
        }

    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Failed to list secrets: {str(e)}")

@router.get("/secrets/{secret_name}")
async def get_secret(secret_name: str, include_flag: bool = Query(False)):
    """Get a specific secret value (VULNERABILITY: No auth + exposes secrets!)"""

    # VULNERABILITY: No authentication check - anyone can read any secret!
    secrets_client = get_secrets_client()

    try:
        response = secrets_client.get_secret_value(SecretId=secret_name)

        secret_data = json.loads(response['SecretString'])

        result = {
            "secret_name": secret_name,
            "arn": response['ARN'],
            "version_id": response.get('VersionId'),
            "created_date": response.get('CreatedDate').isoformat() if response.get('CreatedDate') else None,
            "secret_data": secret_data,
            "warning": "VULNERABILITY: Secrets exposed without authentication!"
        }

        # VULNERABILITY: Flag embedded in Okta token
        if secret_name == "okta_api_token" and "token" in secret_data:
            token_value = secret_data["token"]
            # Extract flag from token
            if "flag{" in token_value:
                import re
                flag_match = re.search(r'flag\{[^}]+\}', token_value)
                if flag_match:
                    result["flag"] = flag_match.group(0)
                    result["message"] = "FLAG02: Over-permissive IAM allows reading Secrets Manager!"

        return result

    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            raise HTTPException(status_code=404, detail=f"Secret '{secret_name}' not found")
        raise HTTPException(status_code=500, detail=f"Failed to get secret: {str(e)}")