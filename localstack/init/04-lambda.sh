#!/bin/bash
# DVTC LocalStack Lambda Setup - INTENTIONALLY VULNERABLE FOR CTF

# Set AWS credentials for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
echo "Setting up Lambda functions with vulnerabilities..."

# Create Lambda deployment package
mkdir -p /tmp/lambda
cat > /tmp/lambda/report_generator.py << 'EOF'
import json
import boto3
import os
from datetime import datetime, timedelta
import base64

def lambda_handler(event, context):
    """
    Vulnerable report generator Lambda
    INTENTIONAL VULNERABILITIES:
    - Template injection
    - Path traversal
    - Information disclosure
    - No input validation
    """

    # Get parameters from event
    query_params = event.get('queryStringParameters', {}) or {}
    template = query_params.get('template', 'default')
    format_type = query_params.get('format', 'json')
    customer_id = query_params.get('customer_id', 'anonymous')

    # VULNERABILITY: Template injection - user can inject arbitrary templates
    if template == 'custom':
        template_content = query_params.get('template_content', '')
        if template_content:
            # VULNERABILITY: Direct eval of user input
            try:
                # This is intentionally vulnerable to code injection
                result = eval(f"f'{template_content}'")
                return {
                    'statusCode': 200,
                    'body': json.dumps({
                        'report': result,
                        'generated_at': datetime.now().isoformat()
                    }),
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'  # VULNERABILITY: CORS misconfiguration
                    }
                }
            except Exception as e:
                return {
                    'statusCode': 500,
                    'body': json.dumps({'error': str(e), 'hint': 'Try template=../../etc/passwd'})
                }

    # VULNERABILITY: Path traversal in template loading
    if '../' in template or '..\\' in template:
        try:
            # Attempt to read file (intentionally vulnerable)
            with open(f'/tmp/{template}', 'r') as f:
                file_content = f.read()
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'report': file_content,
                    'flag': 'flag{template_traversal}' if 'passwd' in template else None
                }),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        except:
            pass

    # Generate default report
    report_data = {
        'title': 'Security Compliance Report',
        'customer_id': customer_id,
        'generated_at': datetime.now().isoformat(),
        'compliance_status': {
            'soc2': 'PASSED',
            'iso27001': 'IN_PROGRESS',
            'hipaa': 'NOT_STARTED',
            'gdpr': 'PASSED'
        },
        'vulnerabilities_found': 0,  # VULNERABILITY: Always reports 0 vulnerabilities
        'last_scan': (datetime.now() - timedelta(days=7)).isoformat(),
        'next_audit': (datetime.now() + timedelta(days=30)).isoformat()
    }

    # VULNERABILITY: Information disclosure in debug mode
    if query_params.get('debug') == 'true':
        report_data['debug_info'] = {
            'lambda_arn': context.invoked_function_arn if context else 'local',
            'aws_request_id': context.aws_request_id if context else 'local-request',
            'environment': dict(os.environ),  # VULNERABILITY: Exposes all env vars
            'secrets_manager_hint': 'Try accessing secretsmanager with the exposed IAM role',
            'iam_role': 'arn:aws:iam::000000000000:role/dvtc-trustcenter-role'
        }

    # VULNERABILITY: Weak encryption for "encrypted" reports
    if query_params.get('encrypted') == 'true':
        # Using base64 instead of actual encryption (VULNERABILITY)
        report_data['encrypted_data'] = base64.b64encode(
            json.dumps(report_data).encode()
        ).decode()
        report_data['encryption_used'] = 'base64'  # VULNERABILITY: Not real encryption
        report_data['hint'] = 'This is not real encryption, just encoding!'

    return {
        'statusCode': 200,
        'body': json.dumps(report_data),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  # VULNERABILITY: Allow all origins
            'X-Debug-Mode': 'enabled',  # VULNERABILITY: Debug header
            'X-Generator-Version': '1.0.0-vulnerable'
        }
    }

def audit_trail_handler(event, context):
    """
    Audit trail download handler
    VULNERABILITY: No authentication required
    """

    # Generate fake audit trail
    audit_entries = []
    for i in range(10):
        audit_entries.append({
            'timestamp': (datetime.now() - timedelta(hours=i)).isoformat(),
            'user': 'admin@dvtc.local' if i % 3 == 0 else 'user@customer.com',
            'action': ['LOGIN', 'VIEW_REPORT', 'DOWNLOAD_POLICY', 'MODIFY_SETTINGS'][i % 4],
            'ip_address': f'192.168.1.{100+i}',
            'success': True
        })

    # VULNERABILITY: Admin actions exposed without auth
    audit_entries.append({
        'timestamp': datetime.now().isoformat(),
        'user': 'system',
        'action': 'FLAG_DISCOVERED',
        'details': 'flag{who_needs_auth}',
        'ip_address': '127.0.0.1',
        'success': True
    })

    return {
        'statusCode': 200,
        'body': json.dumps({
            'audit_trail': audit_entries,
            'export_date': datetime.now().isoformat(),
            'total_entries': len(audit_entries)
        }),
        'headers': {
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename=audit_trail.json',
            'Access-Control-Allow-Origin': '*'
        }
    }

def compliance_checker_handler(event, context):
    """
    Compliance status checker
    VULNERABILITY: Returns sensitive internal data
    """

    # Fake compliance check
    compliance_data = {
        'frameworks': {
            'soc2': {
                'status': 'COMPLIANT',
                'score': 98,
                'last_audit': '2024-06-15',
                'auditor': 'TrustVerify Inc.',
                'certificate_url': 'https://dvtc-public-reports.s3.amazonaws.com/soc2-cert.pdf'
            },
            'iso27001': {
                'status': 'IN_PROGRESS',
                'score': 75,
                'gaps': ['Access Reviews', 'Incident Response Plan'],
                'estimated_completion': '2024-12-31'
            }
        },
        'internal_notes': {
            'admin_override': '/api/admin/force-compliance?token=admin123',
            'bypass_validation': True,
            'flag': 'flag{compliance_by_css}'  # VULNERABILITY: Flag in response
        }
    }

    return {
        'statusCode': 200,
        'body': json.dumps(compliance_data),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
EOF

# Create Lambda deployment package
cd /tmp/lambda
zip -q function.zip report_generator.py

# Create the Lambda functions
echo "Creating report_generator Lambda..."
aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name generate_report \
    --runtime python3.11 \
    --role arn:aws:iam::000000000000:role/dvtc-trustcenter-role \
    --handler report_generator.lambda_handler \
    --zip-file fileb://function.zip \
    --timeout 30 \
    --memory-size 256 \
    --environment Variables="{
        STAGE=production,
        DEBUG=true,
        SECRET_MANAGER_ENABLED=true
    }" 2>/dev/null || \
aws --endpoint-url=http://localhost:4566 lambda update-function-code \
    --function-name generate_report \
    --zip-file fileb://function.zip 2>/dev/null

echo "Creating audit_trail Lambda..."
aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name download_audit_trail \
    --runtime python3.11 \
    --role arn:aws:iam::000000000000:role/dvtc-admin-role \
    --handler report_generator.audit_trail_handler \
    --zip-file fileb://function.zip \
    --timeout 30 \
    --memory-size 256 2>/dev/null || \
aws --endpoint-url=http://localhost:4566 lambda update-function-code \
    --function-name download_audit_trail \
    --zip-file fileb://function.zip 2>/dev/null

echo "Creating compliance_checker Lambda..."
aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name compliance_checker \
    --runtime python3.11 \
    --role arn:aws:iam::000000000000:role/dvtc-trustcenter-role \
    --handler report_generator.compliance_checker_handler \
    --zip-file fileb://function.zip \
    --timeout 30 \
    --memory-size 256 2>/dev/null || \
aws --endpoint-url=http://localhost:4566 lambda update-function-code \
    --function-name compliance_checker \
    --zip-file fileb://function.zip 2>/dev/null

# Clean up
rm -rf /tmp/lambda

echo "Lambda functions created with intentional vulnerabilities!"