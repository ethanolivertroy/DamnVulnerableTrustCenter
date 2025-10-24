#!/bin/bash
# DVTC LocalStack IAM Setup - INTENTIONALLY VULNERABLE FOR CTF

# Set AWS credentials for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
echo "Setting up IAM roles and policies..."

# Create over-permissive role (VULNERABILITY: Too many permissions)
aws --endpoint-url=http://localhost:4566 iam create-role \
    --role-name dvtc-trustcenter-role \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": {"Service": ["lambda.amazonaws.com", "ec2.amazonaws.com"]},
            "Action": "sts:AssumeRole"
        }]
    }' 2>/dev/null

# Attach overly permissive policy (VULNERABILITY: Wildcard permissions)
aws --endpoint-url=http://localhost:4566 iam put-role-policy \
    --role-name dvtc-trustcenter-role \
    --policy-name TrustCenterFullAccess \
    --policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Action": [
                "secretsmanager:*",
                "s3:*",
                "lambda:*",
                "iam:*"
            ],
            "Resource": "*"
        }]
    }'

# Create reporter role with limited permissions
aws --endpoint-url=http://localhost:4566 iam create-role \
    --role-name dvtc-reporter-role \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": {"Service": "lambda.amazonaws.com"},
            "Action": "sts:AssumeRole"
        }]
    }' 2>/dev/null

# Attach reporter policy
aws --endpoint-url=http://localhost:4566 iam put-role-policy \
    --role-name dvtc-reporter-role \
    --policy-name ReporterAccess \
    --policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "lambda:InvokeFunction"
            ],
            "Resource": ["arn:aws:s3:::dvtc-public-reports/*", "arn:aws:lambda:*:*:function:generate_report"]
        }]
    }'

# Create admin role (VULNERABILITY: Can be assumed by anyone)
aws --endpoint-url=http://localhost:4566 iam create-role \
    --role-name dvtc-admin-role \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": "sts:AssumeRole",
            "Condition": {}
        }]
    }' 2>/dev/null

# Attach admin policy
aws --endpoint-url=http://localhost:4566 iam put-role-policy \
    --role-name dvtc-admin-role \
    --policy-name AdminAccess \
    --policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }]
    }'

# Output role ARNs for backend use
echo '{
    "trustcenter_role": "arn:aws:iam::000000000000:role/dvtc-trustcenter-role",
    "reporter_role": "arn:aws:iam::000000000000:role/dvtc-reporter-role",
    "admin_role": "arn:aws:iam::000000000000:role/dvtc-admin-role"
}' > /tmp/iam-outputs.json

echo "IAM setup complete with intentional vulnerabilities!"