#!/bin/bash
# DVTC LocalStack S3 Setup - INTENTIONALLY VULNERABLE FOR CTF

# Set AWS credentials for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

echo "Setting up S3 buckets and seeding data..."

# Create public reports bucket (VULNERABILITY: Public read access)
aws --endpoint-url=http://localhost:4566 s3 mb s3://dvtc-public-reports 2>/dev/null

# Create internal reports bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://dvtc-internal-reports 2>/dev/null

# Create customer data bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://dvtc-customer-data 2>/dev/null

# Set public bucket policy (VULNERABILITY: Too permissive)
aws --endpoint-url=http://localhost:4566 s3api put-bucket-policy \
    --bucket dvtc-public-reports \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [{
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["s3:GetObject", "s3:ListBucket"],
            "Resource": [
                "arn:aws:s3:::dvtc-public-reports",
                "arn:aws:s3:::dvtc-public-reports/*"
            ]
        }]
    }'

# Set CORS for public bucket (VULNERABILITY: Allow all origins)
aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors \
    --bucket dvtc-public-reports \
    --cors-configuration '{
        "CORSRules": [{
            "AllowedOrigins": ["*"],
            "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
            "AllowedHeaders": ["*"],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000
        }]
    }'

# Create seed files if they exist
if [ -d "/seed/reports" ]; then
    for file in /seed/reports/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            aws --endpoint-url=http://localhost:4566 s3 cp "$file" s3://dvtc-public-reports/ 2>/dev/null
            aws --endpoint-url=http://localhost:4566 s3 cp "$file" s3://dvtc-internal-reports/ 2>/dev/null
            echo "Uploaded $filename to S3 buckets"
        fi
    done
else
    # Create dummy reports if seed files don't exist
    echo "Creating dummy reports..."

    # SOC2 Report (contains flag in metadata)
    echo "SOC 2 Type II Audit Report - CONFIDENTIAL

Audit Period: January 1, 2024 - June 30, 2024
Auditor: TrustVerify Inc.

Executive Summary:
DVTC has successfully maintained security controls...

[Hidden in metadata: flag{presigned_url_forever}]

Control Environment:
- Access Control: PASSED
- Data Encryption: PASSED*
- Incident Response: PASSED
- Vendor Management: NEEDS IMPROVEMENT

*Note: FIPS mode can be toggled client-side (security issue)

Recommendations:
1. Implement proper IAM role boundaries
2. Reduce presigned URL expiration times
3. Enable MFA for all admin accounts

Internal Notes (should not be in public report):
- Admin API endpoint: /api/admin/downloadAuditTrail
- Backup bucket: dvtc-internal-reports
- Lambda function lacks authentication" > /tmp/soc2-report.txt

    aws --endpoint-url=http://localhost:4566 s3 cp /tmp/soc2-report.txt s3://dvtc-public-reports/soc2-report-2024.txt
    aws --endpoint-url=http://localhost:4566 s3 cp /tmp/soc2-report.txt s3://dvtc-internal-reports/soc2-report-2024-internal.txt

    # Customer Attestation (contains sensitive info)
    echo "Customer Security Attestation

Company: TechCorp Inc.
Date: November 2024
Status: Approved

Security Questionnaire Results:
- Data Encryption: Yes (AES-256)
- Access Controls: RBAC Implemented
- Compliance: SOC2, ISO27001
- Incident Response: 24/7 SOC

Internal Configuration:
bucket_name: dvtc-customer-data
admin_user: admin@dvtc.local
api_key_partial: sk_live_4242...
okta_domain: dvtc.okta.com

Notes: Customer uses weak passwords, recommend enforcement" > /tmp/customer-attestation.txt

    aws --endpoint-url=http://localhost:4566 s3 cp /tmp/customer-attestation.txt s3://dvtc-public-reports/customer-attestation.pdf

    # Pentest Report (intentionally leaked)
    echo "Penetration Test Report - DRAFT

Critical Findings:
1. Unauthenticated Lambda execution via API Gateway
2. Long-lived presigned URLs (7 days)
3. IAM roles with wildcard permissions
4. Secrets Manager accessible without auth
5. Client-side security badge manipulation

flag{too_much_power} found in Secrets Manager" > /tmp/pentest-draft.txt

    aws --endpoint-url=http://localhost:4566 s3 cp /tmp/pentest-draft.txt s3://dvtc-internal-reports/pentest-draft-do-not-share.txt
fi

# Set bucket versioning (to hide deleted files)
aws --endpoint-url=http://localhost:4566 s3api put-bucket-versioning \
    --bucket dvtc-internal-reports \
    --versioning-configuration Status=Enabled

# Create a "deleted" file with sensitive info (VULNERABILITY: Versioning exposes deleted content)
echo "DELETED: Database credentials
postgres://admin:flag{internet_never_forgets}@db.dvtc.internal:5432/trustcenter" > /tmp/deleted-creds.txt
aws --endpoint-url=http://localhost:4566 s3 cp /tmp/deleted-creds.txt s3://dvtc-internal-reports/.env.backup
aws --endpoint-url=http://localhost:4566 s3 rm s3://dvtc-internal-reports/.env.backup

echo "S3 buckets created and seeded with vulnerable configurations!"