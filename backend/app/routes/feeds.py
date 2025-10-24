from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
import json
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
import os

router = APIRouter()

def generate_compliance_data():
    """Generate compliance data with intentional information leaks"""
    return {
        "company": "DVTC Corp",
        "generated_at": datetime.now().isoformat(),
        "compliance_frameworks": {
            "soc2": {
                "status": "compliant",
                "type": "Type II",
                "audit_period": {
                    "start": (datetime.now() - timedelta(days=180)).isoformat(),
                    "end": (datetime.now() - timedelta(days=1)).isoformat()
                },
                "auditor": "TrustVerify Inc.",
                "controls": {
                    "total": 104,
                    "passed": 103,
                    "failed": 1,
                    "not_applicable": 0
                },
                "certificate_url": "https://dvtc-public-reports.s3.amazonaws.com/soc2-cert.pdf"
            },
            "iso27001": {
                "status": "in_progress",
                "version": "2013",
                "stage": "Stage 2 Audit",
                "expected_completion": (datetime.now() + timedelta(days=90)).isoformat(),
                "gaps": ["Access Reviews", "Vendor Management"],
                "consultant": "SecureCompliance Partners"
            },
            "gdpr": {
                "status": "compliant",
                "dpo": {
                    "name": "Jane Smith",
                    "email": "dpo@dvtc.local",
                    "phone": "+1-555-0123"  # VULNERABILITY: PII exposed
                },
                "data_categories": ["customer_data", "employee_data", "usage_metrics"],
                "retention_period": "3 years",
                "deletion_process": "automated"
            },
            "hipaa": {
                "status": "compliant",
                "covered_entity": False,
                "business_associate": True,
                "baa_available": True,
                "encryption": {
                    "at_rest": "AES-256",
                    "in_transit": "TLS 1.3",
                    "key_management": "AWS KMS"  # VULNERABILITY: Reveals infrastructure
                }
            }
        },
        "infrastructure": {
            "cloud_provider": "AWS",
            "regions": ["us-east-1", "us-west-2"],
            "compliance_scope": {
                "included": [
                    "production_vpc",
                    "rds_instances",
                    "s3_buckets"
                ],
                "excluded": [
                    "dev_environment",
                    "test_databases"
                ]
            },
            # VULNERABILITY: Internal resource names exposed
            "resources": {
                "s3_buckets": [
                    "dvtc-public-reports",
                    "dvtc-internal-reports",
                    "dvtc-customer-data"
                ],
                "databases": [
                    "postgres://prod-db.dvtc.internal:5432/trustcenter"
                ],
                "lambda_functions": [
                    "generate_report",
                    "compliance_checker",
                    "download_audit_trail"
                ]
            }
        },
        "security_controls": {
            "authentication": {
                "mfa_required": True,
                "sso_provider": "Okta",
                "password_policy": {
                    "min_length": 8,
                    "complexity": "low",  # VULNERABILITY: Weak password policy
                    "rotation_days": 90
                }
            },
            "network_security": {
                "waf_enabled": True,
                "ddos_protection": "CloudFlare",
                "vpn_required": False,  # VULNERABILITY: No VPN required
                "allowed_ips": ["0.0.0.0/0"]  # VULNERABILITY: Allow all IPs
            },
            "data_protection": {
                "encryption_at_rest": True,
                "encryption_in_transit": True,
                "backup_frequency": "daily",
                "backup_retention": "30 days",
                "backup_testing": "never"  # VULNERABILITY: Backups not tested
            }
        },
        "audit_info": {
            "last_pentest": (datetime.now() - timedelta(days=365)).isoformat(),  # VULNERABILITY: Old pentest
            "pentest_findings": {
                "critical": 3,
                "high": 7,
                "medium": 15,
                "low": 22,
                "remediated": 10,
                "accepted_risk": 37  # VULNERABILITY: Many accepted risks
            },
            "next_audit": (datetime.now() + timedelta(days=30)).isoformat(),
            "audit_logs_retention": "90 days"
        },
        # VULNERABILITY: Admin information exposed
        "internal_contacts": {
            "security_team": "security@dvtc.local",
            "admin_user": "admin@dvtc.local",
            "api_support": "api-support@dvtc.local"
        },
        "api_endpoints": {
            "public": "https://api.dvtc.com",
            "internal": "http://internal-api.dvtc.local:8080",
            "admin": "https://admin.dvtc.local:8443",
            "metrics": "http://prometheus.dvtc.local:9090"
        },
        # VULNERABILITY: Contains flag
        "_metadata": {
            "version": "1.0",
            "classification": "PUBLIC",
            "flag": "flag{json_bits_betray}",
            "debug_mode": True
        }
    }

@router.get("/compliance.json")
async def get_compliance_json():
    """Machine-readable compliance feed in JSON format"""
    data = generate_compliance_data()
    return JSONResponse(
        content=data,
        headers={
            "Content-Type": "application/json",
            "X-Compliance-Version": "1.0",
            "X-Last-Updated": datetime.now().isoformat(),
            # VULNERABILITY: Debug header exposes information
            "X-Debug-Info": "Generated from /api/feeds/compliance.json"
        }
    )

@router.get("/compliance.xml")
async def get_compliance_xml():
    """Machine-readable compliance feed in XML format"""
    data = generate_compliance_data()

    # Convert to XML (VULNERABILITY: May be vulnerable to XXE if parsed incorrectly)
    root = ET.Element("ComplianceReport")
    root.set("xmlns", "http://dvtc.local/compliance/v1")
    root.set("generated", datetime.now().isoformat())

    # Company info
    company = ET.SubElement(root, "Company")
    company.text = data["company"]

    # Frameworks
    frameworks = ET.SubElement(root, "Frameworks")
    for fw_name, fw_data in data["compliance_frameworks"].items():
        framework = ET.SubElement(frameworks, "Framework")
        framework.set("name", fw_name)
        framework.set("status", fw_data["status"])

        # Add all framework data as sub-elements
        for key, value in fw_data.items():
            if key not in ["name", "status"]:
                elem = ET.SubElement(framework, key.replace("_", ""))
                if isinstance(value, dict):
                    elem.text = json.dumps(value)
                else:
                    elem.text = str(value)

    # Infrastructure (VULNERABILITY: Exposes too much)
    infra = ET.SubElement(root, "Infrastructure")
    for bucket in data["infrastructure"]["resources"]["s3_buckets"]:
        bucket_elem = ET.SubElement(infra, "S3Bucket")
        bucket_elem.text = bucket

    for db in data["infrastructure"]["resources"]["databases"]:
        db_elem = ET.SubElement(infra, "Database")
        db_elem.text = db  # VULNERABILITY: Connection string exposed

    # Admin info (VULNERABILITY)
    admin = ET.SubElement(root, "AdminInfo")
    admin_user = ET.SubElement(admin, "AdminUser")
    admin_user.text = data["internal_contacts"]["admin_user"]

    # Flag (VULNERABILITY)
    metadata = ET.SubElement(root, "Metadata")
    flag_elem = ET.SubElement(metadata, "Flag")
    flag_elem.text = "flag{json_bits_betray}"

    xml_str = ET.tostring(root, encoding="unicode")

    return Response(
        content=xml_str,
        media_type="application/xml",
        headers={
            "Content-Type": "application/xml",
            "X-XML-Version": "1.0",
            # VULNERABILITY: XXE hint
            "X-Parser-Info": "Uses default XML parser, DTD processing enabled"
        }
    )

@router.get("/security-headers.json")
async def get_security_headers():
    """Security headers configuration feed"""

    headers_config = {
        "headers": {
            "Strict-Transport-Security": {
                "value": "max-age=31536000; includeSubDomains",
                "enabled": True
            },
            "X-Frame-Options": {
                "value": "SAMEORIGIN",
                "enabled": False  # VULNERABILITY: Clickjacking possible
            },
            "X-Content-Type-Options": {
                "value": "nosniff",
                "enabled": True
            },
            "Content-Security-Policy": {
                "value": "default-src 'self' 'unsafe-inline' 'unsafe-eval' *",  # VULNERABILITY: Too permissive
                "enabled": True
            },
            "X-XSS-Protection": {
                "value": "1; mode=block",
                "enabled": False  # VULNERABILITY: XSS protection disabled
            },
            "Referrer-Policy": {
                "value": "no-referrer",
                "enabled": False
            },
            "Permissions-Policy": {
                "value": "geolocation=*, camera=*, microphone=*",  # VULNERABILITY: All permissions allowed
                "enabled": True
            }
        },
        "cors": {
            "allowed_origins": ["*"],  # VULNERABILITY: Allow all origins
            "allowed_methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allowed_headers": ["*"],
            "expose_headers": ["*"],
            "allow_credentials": True  # VULNERABILITY: Credentials with wildcard origin
        },
        "rate_limiting": {
            "enabled": False,  # VULNERABILITY: No rate limiting
            "requests_per_minute": 1000,
            "burst_size": 100
        },
        "api_keys": {
            "required": False,  # VULNERABILITY: API keys not required
            "header_name": "X-API-Key",
            "validation_endpoint": "/api/validate-key"
        }
    }

    return JSONResponse(
        content=headers_config,
        headers={
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600"  # VULNERABILITY: Cached sensitive config
        }
    )

@router.get("/vendors.csv")
async def get_vendors_csv():
    """Vendor list in CSV format"""

    # VULNERABILITY: Exposes vendor information
    csv_content = """vendor_name,service_type,risk_level,contract_value,api_key,notes
AWS,Infrastructure,Low,500000,AKIAIOSFODNN7EXAMPLE,Primary cloud provider
Okta,Authentication,Medium,50000,00Oajf8q9s5Ksf8,SSO provider - token in secrets manager
Stripe,Payment Processing,High,100000,sk_test_4242,Payment gateway - test mode
SendGrid,Email,Low,10000,SG.xxxxxxxxxxxx,Transactional emails
Datadog,Monitoring,Low,30000,dd_api_key_12345,Metrics and logs
GitHub,Source Control,Medium,5000,ghp_xxxxxxxxxxxx,Code repository
Slack,Communication,Low,8000,xoxb-xxxxxxxxxxxx,Team communication
PagerDuty,Incident Response,Medium,15000,pd_key_xxxxx,On-call management
Cloudflare,CDN/DDoS,Low,20000,cf_api_xxxxx,DDoS protection
Qualys,Vulnerability Scanning,Medium,40000,qualys_api_xxx,Quarterly scans"""

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=vendors.csv",
            # VULNERABILITY: Exposes internal information
            "X-Total-Vendors": "10",
            "X-High-Risk-Vendors": "1",
            "X-Total-Spend": "$878,000"
        }
    )

@router.get("/audit-schedule.ics")
async def get_audit_schedule():
    """Audit schedule in iCalendar format"""

    # VULNERABILITY: Exposes audit schedule
    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DVTC//Audit Schedule//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH

BEGIN:VEVENT
DTSTART:{(datetime.now() + timedelta(days=30)).strftime('%Y%m%d')}T090000Z
DTEND:{(datetime.now() + timedelta(days=30)).strftime('%Y%m%d')}T170000Z
SUMMARY:SOC2 Type II Audit
DESCRIPTION:Annual SOC2 audit with TrustVerify Inc.\\nAuditor: John Smith\\nContact: audit@trustverify.com\\nScope: All production systems\\nFlag: Check S3 bucket configurations
LOCATION:DVTC HQ Conference Room A
STATUS:CONFIRMED
END:VEVENT

BEGIN:VEVENT
DTSTART:{(datetime.now() + timedelta(days=60)).strftime('%Y%m%d')}T100000Z
DTEND:{(datetime.now() + timedelta(days=60)).strftime('%Y%m%d')}T120000Z
SUMMARY:Penetration Test Kickoff
DESCRIPTION:Quarterly pentest\\nVendor: SecureTest Labs\\nScope: External and internal\\nCredentials: admin/admin123
LOCATION:Virtual - Zoom
STATUS:TENTATIVE
END:VEVENT

BEGIN:VEVENT
DTSTART:{(datetime.now() + timedelta(days=90)).strftime('%Y%m%d')}T140000Z
DTEND:{(datetime.now() + timedelta(days=90)).strftime('%Y%m%d')}T160000Z
SUMMARY:ISO 27001 Stage 2 Audit
DESCRIPTION:ISO certification audit\\nAuditor: CertSecure Global\\nPrep: Disable debug mode before audit!
LOCATION:DVTC HQ
STATUS:CONFIRMED
END:VEVENT

END:VCALENDAR"""

    return Response(
        content=ics_content,
        media_type="text/calendar",
        headers={
            "Content-Type": "text/calendar",
            "Content-Disposition": "attachment; filename=audit-schedule.ics"
        }
    )