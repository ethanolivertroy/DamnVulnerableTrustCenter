"""
Mock AWS Services for DVTC
Replaces LocalStack with simple in-memory implementations.
All CTF flags and vulnerabilities work identically without needing real AWS.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import json
import hashlib
import re


class MockS3:
    """
    Mock S3 client that simulates:
    - Presigned URL generation (FLAG01)
    - Object storage and retrieval
    - Versioning for deleted file recovery (FLAG09)
    """

    def __init__(self):
        # Initialize with seed data
        self._buckets: Dict[str, Dict[str, Any]] = {
            "dvtc-public-reports": {
                "versioning": False,
                "objects": {
                    "soc2-report-2024.txt": {
                        "content": b"SOC 2 Type II Report - DVTC Trust Center\n\nThis report is publicly available.",
                        "content_type": "text/plain",
                        "versions": []
                    },
                    "customer-attestation.pdf": {
                        "content": b"Customer Security Attestation Document",
                        "content_type": "application/pdf",
                        "versions": []
                    }
                }
            },
            "dvtc-internal-reports": {
                "versioning": True,
                "objects": {
                    "pentest-draft-do-not-share.txt": {
                        "content": b"CONFIDENTIAL: Penetration Test Report\n\nCritical findings redacted.",
                        "content_type": "text/plain",
                        "versions": []
                    },
                    "internal-soc2-plan.pdf": {
                        "content": b"Internal SOC2 Implementation Plan - CONFIDENTIAL",
                        "content_type": "application/pdf",
                        "versions": []
                    },
                    "audit-trail.json": {
                        "content": json.dumps({"events": [], "exported": datetime.now().isoformat()}).encode(),
                        "content_type": "application/json",
                        "versions": []
                    },
                    ".env.backup": {
                        "content": b"",  # Deleted, but has version history
                        "content_type": "text/plain",
                        "deleted": True,
                        "versions": [
                            {
                                "version_id": "v1-initial",
                                "content": b"# Old environment file\nDATABASE_URL=postgres://admin:flag{internet_never_forgets}@db.dvtc.internal:5432/trustcenter\nSECRET_KEY=old_secret_123\n",
                                "last_modified": datetime.now() - timedelta(days=30),
                                "is_latest": False
                            }
                        ]
                    }
                }
            }
        }

        # Track delete markers for versioning
        self._delete_markers: Dict[str, List[Dict]] = {
            "dvtc-internal-reports": [
                {
                    "Key": ".env.backup",
                    "VersionId": "delete-marker-1",
                    "LastModified": datetime.now() - timedelta(days=7),
                    "IsLatest": True
                }
            ]
        }

    def generate_presigned_url(
        self,
        ClientMethod: str,
        Params: Dict[str, str],
        ExpiresIn: int = 3600
    ) -> str:
        """Generate a mock presigned URL"""
        bucket = Params.get('Bucket', 'unknown')
        key = Params.get('Key', 'unknown')

        # Generate a realistic-looking presigned URL
        signature = hashlib.md5(f"{bucket}/{key}/{ExpiresIn}".encode()).hexdigest()
        expires = int((datetime.now() + timedelta(seconds=ExpiresIn)).timestamp())

        return f"http://localhost:8000/mock-s3/{bucket}/{key}?X-Amz-Expires={ExpiresIn}&X-Amz-Signature={signature}&expires={expires}"

    def get_object(self, Bucket: str, Key: str, VersionId: Optional[str] = None) -> Dict:
        """Get an object from mock S3"""
        if Bucket not in self._buckets:
            raise MockClientError("NoSuchBucket", f"Bucket '{Bucket}' does not exist")

        bucket = self._buckets[Bucket]
        if Key not in bucket["objects"]:
            raise MockClientError("NoSuchKey", f"Key '{Key}' does not exist")

        obj = bucket["objects"][Key]

        # Handle versioning
        if VersionId and obj.get("versions"):
            for version in obj["versions"]:
                if version["version_id"] == VersionId:
                    return {
                        "Body": MockStreamingBody(version["content"]),
                        "ContentType": obj.get("content_type", "application/octet-stream"),
                        "VersionId": VersionId
                    }
            raise MockClientError("NoSuchVersion", f"Version '{VersionId}' does not exist")

        # Check if deleted
        if obj.get("deleted") and obj.get("versions"):
            # Return latest version for deleted objects
            version = obj["versions"][0]
            return {
                "Body": MockStreamingBody(version["content"]),
                "ContentType": obj.get("content_type", "application/octet-stream"),
                "VersionId": version["version_id"]
            }

        return {
            "Body": MockStreamingBody(obj["content"]),
            "ContentType": obj.get("content_type", "application/octet-stream")
        }

    def put_object(
        self,
        Bucket: str,
        Key: str,
        Body: bytes,
        ACL: str = "private",
        **kwargs
    ) -> Dict:
        """Put an object into mock S3"""
        if Bucket not in self._buckets:
            self._buckets[Bucket] = {"versioning": False, "objects": {}}

        self._buckets[Bucket]["objects"][Key] = {
            "content": Body if isinstance(Body, bytes) else Body.encode(),
            "content_type": kwargs.get("ContentType", "application/octet-stream"),
            "acl": ACL,
            "versions": []
        }

        return {"ETag": hashlib.md5(Body if isinstance(Body, bytes) else Body.encode()).hexdigest()}

    def list_object_versions(self, Bucket: str, Prefix: str = "") -> Dict:
        """List object versions including delete markers (FLAG09)"""
        if Bucket not in self._buckets:
            raise MockClientError("NoSuchBucket", f"Bucket '{Bucket}' does not exist")

        bucket = self._buckets[Bucket]
        versions = []
        delete_markers = []

        for key, obj in bucket["objects"].items():
            if Prefix and not key.startswith(Prefix):
                continue

            # Add current version
            if not obj.get("deleted"):
                versions.append({
                    "Key": key,
                    "VersionId": f"current-{hashlib.md5(key.encode()).hexdigest()[:8]}",
                    "LastModified": datetime.now(),
                    "Size": len(obj["content"]),
                    "IsLatest": True
                })

            # Add historical versions
            for version in obj.get("versions", []):
                versions.append({
                    "Key": key,
                    "VersionId": version["version_id"],
                    "LastModified": version["last_modified"],
                    "Size": len(version["content"]),
                    "IsLatest": version.get("is_latest", False)
                })

        # Add delete markers
        if Bucket in self._delete_markers:
            for marker in self._delete_markers[Bucket]:
                if not Prefix or marker["Key"].startswith(Prefix):
                    delete_markers.append(marker)

        return {
            "Versions": versions,
            "DeleteMarkers": delete_markers
        }


class MockSecretsManager:
    """
    Mock Secrets Manager client that simulates:
    - Secret listing (FLAG02 discovery)
    - Secret retrieval (FLAG02 exploitation)
    """

    def __init__(self):
        self._secrets: Dict[str, Dict] = {
            "okta_api_token": {
                "ARN": "arn:aws:secretsmanager:us-east-1:000000000000:secret:okta_api_token",
                "Name": "okta_api_token",
                "Description": "Okta API token for SSO integration",
                "CreatedDate": datetime.now() - timedelta(days=90),
                "LastAccessedDate": datetime.now() - timedelta(hours=2),
                "Tags": [{"Key": "environment", "Value": "production"}],
                "SecretString": json.dumps({
                    "token": "00abcdef-flag{too_much_power}-xyz123",
                    "expires": "2025-12-31"
                })
            },
            "admin_api_key": {
                "ARN": "arn:aws:secretsmanager:us-east-1:000000000000:secret:admin_api_key",
                "Name": "admin_api_key",
                "Description": "Admin API key for internal services",
                "CreatedDate": datetime.now() - timedelta(days=60),
                "LastAccessedDate": datetime.now() - timedelta(days=1),
                "Tags": [{"Key": "environment", "Value": "production"}],
                "SecretString": json.dumps({
                    "key": "sk_admin_supersecret_12345",
                    "created_by": "admin@dvtc.local"
                })
            },
            "jwt_signing_key": {
                "ARN": "arn:aws:secretsmanager:us-east-1:000000000000:secret:jwt_signing_key",
                "Name": "jwt_signing_key",
                "Description": "JWT signing key for authentication",
                "CreatedDate": datetime.now() - timedelta(days=180),
                "LastAccessedDate": datetime.now(),
                "Tags": [{"Key": "rotation", "Value": "disabled"}],
                "SecretString": json.dumps({
                    "secret": "123456",
                    "algorithm": "HS256"
                })
            },
            "database_credentials": {
                "ARN": "arn:aws:secretsmanager:us-east-1:000000000000:secret:database_credentials",
                "Name": "database_credentials",
                "Description": "PostgreSQL database credentials",
                "CreatedDate": datetime.now() - timedelta(days=120),
                "LastAccessedDate": datetime.now() - timedelta(hours=6),
                "Tags": [],
                "SecretString": json.dumps({
                    "host": "db.dvtc.internal",
                    "port": 5432,
                    "username": "postgres",
                    "password": "postgres123",
                    "database": "trustcenter"
                })
            }
        }

    def list_secrets(self) -> Dict:
        """List all secrets"""
        return {
            "SecretList": [
                {
                    "ARN": secret["ARN"],
                    "Name": secret["Name"],
                    "Description": secret["Description"],
                    "CreatedDate": secret["CreatedDate"],
                    "LastAccessedDate": secret["LastAccessedDate"],
                    "Tags": secret["Tags"]
                }
                for secret in self._secrets.values()
            ]
        }

    def get_secret_value(self, SecretId: str) -> Dict:
        """Get a secret value"""
        if SecretId not in self._secrets:
            raise MockClientError("ResourceNotFoundException", f"Secret '{SecretId}' not found")

        secret = self._secrets[SecretId]
        return {
            "ARN": secret["ARN"],
            "Name": secret["Name"],
            "VersionId": hashlib.md5(SecretId.encode()).hexdigest()[:8],
            "SecretString": secret["SecretString"],
            "CreatedDate": secret["CreatedDate"]
        }


class MockStreamingBody:
    """Mock streaming body for S3 get_object responses"""

    def __init__(self, content: bytes):
        self._content = content

    def read(self) -> bytes:
        return self._content


class MockClientError(Exception):
    """Mock boto3 ClientError"""

    def __init__(self, code: str, message: str):
        self.response = {
            "Error": {
                "Code": code,
                "Message": message
            }
        }
        super().__init__(message)


# Singleton instances
_mock_s3: Optional[MockS3] = None
_mock_secrets: Optional[MockSecretsManager] = None


def get_mock_s3_client() -> MockS3:
    """Get or create the mock S3 client"""
    global _mock_s3
    if _mock_s3 is None:
        _mock_s3 = MockS3()
    return _mock_s3


def get_mock_secrets_client() -> MockSecretsManager:
    """Get or create the mock Secrets Manager client"""
    global _mock_secrets
    if _mock_secrets is None:
        _mock_secrets = MockSecretsManager()
    return _mock_secrets
