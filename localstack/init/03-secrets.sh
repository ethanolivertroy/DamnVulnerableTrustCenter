#!/bin/bash
# DVTC LocalStack Secrets Manager Setup - INTENTIONALLY VULNERABLE FOR CTF

# Set AWS credentials for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
echo "Setting up Secrets Manager with vulnerable secrets..."

# Create Okta API token (VULNERABILITY: Real-looking token)
aws --endpoint-url=http://localhost:4566 secretsmanager create-secret \
    --name okta_api_token \
    --description "Okta API Integration Token" \
    --secret-string '{
        "token": "00Oajf8q9s5Ksf8_flag{too_much_power}_kD8sK2mA0",
        "domain": "dvtc.okta.com",
        "client_id": "0oab8eb55Kb9jdMIr5d6",
        "created": "2024-01-15T10:30:00Z",
        "expires": "2025-01-15T10:30:00Z"
    }' \
    --tags '[
        {"Key": "scope", "Value": "integration"},
        {"Key": "service", "Value": "auth"},
        {"Key": "environment", "Value": "production"}
    ]' 2>/dev/null

# Create admin API key (VULNERABILITY: Hardcoded admin credentials)
aws --endpoint-url=http://localhost:4566 secretsmanager create-secret \
    --name admin_api_key \
    --description "Admin API Master Key" \
    --secret-string '{
        "api_key": "sk_live_4242424242424242_flag{secrets_exposed}",
        "api_secret": "ss_live_9876543210987654",
        "admin_password": "Admin123!@#",
        "mfa_backup_codes": ["123456", "234567", "345678", "456789", "567890"]
    }' 2>/dev/null

# Create CI/CD GitHub PAT (VULNERABILITY: Exposed in logs)
aws --endpoint-url=http://localhost:4566 secretsmanager create-secret \
    --name ci_cd_github_pat \
    --description "GitHub Personal Access Token for CI/CD" \
    --secret-string '{
        "token": "ghp_x0x0x0x0x0x0_flag{forklift_deploy}_x0x0x0x0",
        "username": "dvtc-bot",
        "permissions": ["repo", "write:packages", "admin:org"],
        "webhook_secret": "webhook123"
    }' 2>/dev/null

# Create database credentials (VULNERABILITY: Weak password)
aws --endpoint-url=http://localhost:4566 secretsmanager create-secret \
    --name database_credentials \
    --description "PostgreSQL Database Credentials" \
    --secret-string '{
        "host": "db.dvtc.internal",
        "port": 5432,
        "database": "trustcenter",
        "username": "postgres",
        "password": "postgres123",
        "connection_string": "postgresql://postgres:postgres123@db.dvtc.internal:5432/trustcenter"
    }' 2>/dev/null

# Create JWT signing secret (VULNERABILITY: Weak secret)
aws --endpoint-url=http://localhost:4566 secretsmanager create-secret \
    --name jwt_signing_key \
    --description "JWT Token Signing Key" \
    --secret-string '{
        "algorithm": "HS256",
        "secret": "123456",
        "issuer": "dvtc.local",
        "audience": "trust-center-api"
    }' 2>/dev/null

# Create encryption keys (VULNERABILITY: Keys in plaintext)
aws --endpoint-url=http://localhost:4566 secretsmanager create-secret \
    --name encryption_keys \
    --description "Data Encryption Keys" \
    --secret-string '{
        "aes_key": "0123456789abcdef0123456789abcdef",
        "hmac_key": "fedcba9876543210fedcba9876543210",
        "fips_mode": false,
        "rotation_date": "2024-12-31"
    }' 2>/dev/null

# Create Stripe API keys (fake but realistic)
aws --endpoint-url=http://localhost:4566 secretsmanager create-secret \
    --name stripe_keys \
    --description "Stripe Payment Integration" \
    --secret-string '{
        "publishable_key": "pk_test_51234567890abcdefghijk",
        "secret_key": "sk_test_51234567890_flag{payment_processor}_lmnop",
        "webhook_endpoint_secret": "whsec_abcd1234efgh5678ijkl"
    }' 2>/dev/null

# Create AWS credentials (VULNERABILITY: Real-looking AWS keys)
aws --endpoint-url=http://localhost:4566 secretsmanager create-secret \
    --name aws_credentials_prod \
    --description "Production AWS Credentials" \
    --secret-string '{
        "access_key_id": "AKIAIOSFODNN7EXAMPLE",
        "secret_access_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        "region": "us-east-1",
        "account_id": "123456789012"
    }' 2>/dev/null

# Create SSO configuration (VULNERABILITY: Contains internal URLs)
aws --endpoint-url=http://localhost:4566 secretsmanager create-secret \
    --name sso_configuration \
    --description "Single Sign-On Configuration" \
    --secret-string '{
        "saml_endpoint": "https://dvtc.okta.com/app/dvtc/sso/saml",
        "metadata_url": "https://dvtc.okta.com/app/metadata",
        "certificate": "MIIDxTCCAq2gAwIBAgIQ...",
        "admin_bypass_url": "/api/auth/admin-override?token=flag{who_needs_auth}"
    }' 2>/dev/null

# Create internal API endpoints (VULNERABILITY: Exposes internal architecture)
aws --endpoint-url=http://localhost:4566 secretsmanager create-secret \
    --name internal_endpoints \
    --description "Internal Service Endpoints" \
    --secret-string '{
        "audit_trail": "http://audit.dvtc.internal:8080/api/v1/logs",
        "compliance_engine": "http://compliance.dvtc.internal:9000/api/check",
        "report_generator": "http://reports.dvtc.internal:7000/generate",
        "admin_portal": "http://admin.dvtc.internal:5000",
        "debug_endpoint": "http://debug.dvtc.internal:9999/flag{llm_context_leaked}"
    }' 2>/dev/null

echo "Secrets Manager populated with intentionally vulnerable secrets!"