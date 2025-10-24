# LocalStack AWS Services Guide for DVTC

## Quick Start

LocalStack emulates AWS services locally for the DVTC CTF challenges. It runs on port 4566 and provides S3, Lambda, IAM, Secrets Manager, and API Gateway services.

## Configuration

### Set Environment Variables
```bash
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566
```

### Or Create AWS Profile
Add to `~/.aws/config`:
```ini
[profile localstack]
endpoint_url = http://localhost:4566
region = us-east-1
```

Add to `~/.aws/credentials`:
```ini
[profile localstack]
aws_access_key_id = test
aws_secret_access_key = test
```

## Available AWS Resources

### S3 Buckets
```bash
# List all buckets
aws --endpoint-url=http://localhost:4566 s3 ls

# List bucket contents
aws --endpoint-url=http://localhost:4566 s3 ls s3://dvtc-public-reports/
aws --endpoint-url=http://localhost:4566 s3 ls s3://dvtc-internal-reports/
aws --endpoint-url=http://localhost:4566 s3 ls s3://dvtc-customer-data/

# Download files
aws --endpoint-url=http://localhost:4566 s3 cp s3://dvtc-public-reports/soc2-2024.pdf ./
```

Buckets Created:
- `dvtc-public-reports` - Public bucket with overly permissive policy (FLAG01)
- `dvtc-internal-reports` - Contains sensitive internal documents
- `dvtc-customer-data` - Customer PII and sensitive data

### Secrets Manager
```bash
# List all secrets
aws --endpoint-url=http://localhost:4566 secretsmanager list-secrets

# Get secret value (FLAG02 related)
aws --endpoint-url=http://localhost:4566 secretsmanager get-secret-value --secret-id okta_api_token
aws --endpoint-url=http://localhost:4566 secretsmanager get-secret-value --secret-id admin_api_key
aws --endpoint-url=http://localhost:4566 secretsmanager get-secret-value --secret-id ci_cd_github_pat
```

Secrets Available:
- `okta_api_token` - Okta API credentials
- `admin_api_key` - Admin API key with flag
- `ci_cd_github_pat` - GitHub personal access token

### Lambda Functions
```bash
# List functions
aws --endpoint-url=http://localhost:4566 lambda list-functions

# Get function configuration
aws --endpoint-url=http://localhost:4566 lambda get-function --function-name generate_report

# Invoke function (FLAG03 - no auth required)
aws --endpoint-url=http://localhost:4566 lambda invoke \
    --function-name generate_report \
    --payload '{"template": "{{7*7}}"}' \
    output.txt

cat output.txt
```

Functions Available:
- `generate_report` - Report generation with template injection vulnerability

### IAM Roles & Policies
```bash
# List IAM roles
aws --endpoint-url=http://localhost:4566 iam list-roles

# List policies
aws --endpoint-url=http://localhost:4566 iam list-policies

# Get role policy
aws --endpoint-url=http://localhost:4566 iam get-role-policy \
    --role-name dvtc-lambda-role \
    --policy-name dvtc-lambda-policy
```

## CTF Challenge Hints

### FLAG01 - Leaky Presigned URL
- Check S3 bucket policies for overly permissive access
- Look for presigned URLs in the application
- Try accessing buckets directly without authentication

### FLAG02 - Secrets Manager Loot
- IAM roles might be over-permissive
- Try reading secrets from Secrets Manager
- Check if the application exposes AWS credentials

### FLAG03 - No-Auth Lambda
- Lambda functions might not require authentication
- Try invoking functions directly
- Look for template injection vulnerabilities

## Useful Commands

### Check LocalStack Health
```bash
curl http://localhost:4566/_localstack/health
```

### List All Services
```bash
curl http://localhost:4566/_localstack/services
```

### Using Python boto3
```python
import boto3

# Configure client
s3 = boto3.client(
    's3',
    endpoint_url='http://localhost:4566',
    aws_access_key_id='test',
    aws_secret_access_key='test',
    region_name='us-east-1'
)

# List buckets
buckets = s3.list_buckets()
for bucket in buckets['Buckets']:
    print(bucket['Name'])
```

### Using curl Directly
```bash
# List S3 buckets (XML response)
curl http://localhost:4566/

# Get bucket contents
curl http://localhost:4566/dvtc-public-reports
```

## Troubleshooting

### LocalStack Not Responding
```bash
# Check if container is running
docker ps | grep localstack

# Check logs
docker logs dvtc-localstack

# Restart LocalStack
docker compose restart localstack
```

### Permission Denied Errors
- Ensure AWS credentials are set (any value works, e.g., "test")
- Check if LocalStack is fully initialized (wait for health check)

### Resources Not Found
```bash
# Re-run initialization scripts
docker compose exec localstack sh -c "cd /etc/localstack/init/ready.d && for script in *.sh; do bash \$script; done"
```

### Reset Everything
```bash
# Stop all services
make down

# Remove volumes and start fresh
docker compose down -v
make up
```

## Advanced Exploration

### Enumerate Everything
```bash
# S3 bucket policies
for bucket in $(aws --endpoint-url=http://localhost:4566 s3 ls | awk '{print $3}'); do
    echo "=== $bucket ==="
    aws --endpoint-url=http://localhost:4566 s3api get-bucket-policy --bucket $bucket 2>/dev/null
done

# All secrets
aws --endpoint-url=http://localhost:4566 secretsmanager list-secrets --query 'SecretList[*].Name' --output text | \
    xargs -I {} aws --endpoint-url=http://localhost:4566 secretsmanager get-secret-value --secret-id {}

# Lambda environment variables
aws --endpoint-url=http://localhost:4566 lambda list-functions --query 'Functions[*].FunctionName' --output text | \
    xargs -I {} aws --endpoint-url=http://localhost:4566 lambda get-function-configuration --function-name {}
```

## Tips

1. Use `--no-sign-request` for public S3 operations to skip authentication
2. LocalStack Pro features are not required for DVTC challenges
3. Check application logs for AWS API calls to understand the flow
4. Explore the `/localstack/init/` scripts to understand what resources are created
5. Use `--debug` flag with AWS CLI for verbose output
