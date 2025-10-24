from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
from datetime import datetime, timedelta
import json
import random

router = APIRouter()

# Mock data for trust center
TRUST_CENTER_DATA = {
    "company": {
        "name": "DVTC Corp",
        "industry": "Technology",
        "size": "100-500 employees",
        "founded": "2020",
        "headquarters": "San Francisco, CA"
    },
    "certifications": [
        {
            "name": "SOC 2 Type II",
            "status": "Active",
            "issued_date": "2024-01-15",
            "expiry_date": "2025-01-15",
            "auditor": "TrustVerify Inc.",
            "report_available": True
        },
        {
            "name": "ISO 27001",
            "status": "In Progress",
            "issued_date": None,
            "expiry_date": None,
            "auditor": "CertSecure Global",
            "report_available": False
        },
        {
            "name": "HIPAA",
            "status": "Compliant",
            "issued_date": "2023-06-01",
            "expiry_date": "2024-06-01",
            "auditor": "HealthCompliance Pro",
            "report_available": True
        }
    ],
    "security_measures": [
        "256-bit AES encryption at rest",
        "TLS 1.3 in transit",
        "Multi-factor authentication",
        "Regular security audits",
        "24/7 security monitoring",
        "Incident response team"
    ]
}

@router.get("/trust")
async def get_trust_center():
    """Get public trust center information"""
    return {
        "company": TRUST_CENTER_DATA["company"],
        "certifications": TRUST_CENTER_DATA["certifications"],
        "security_measures": TRUST_CENTER_DATA["security_measures"],
        "last_updated": datetime.now().isoformat(),
        "public": True
    }

@router.get("/trust/compliance")
async def get_compliance_status():
    """Get detailed compliance status"""
    frameworks = {
        "soc2": {
            "name": "SOC 2 Type II",
            "status": "compliant",
            "score": 99,
            "controls_passed": 103,
            "controls_total": 104,
            "last_audit": (datetime.now() - timedelta(days=30)).isoformat(),
            "next_audit": (datetime.now() + timedelta(days=335)).isoformat()
        },
        "iso27001": {
            "name": "ISO 27001:2013",
            "status": "in_progress",
            "score": 75,
            "controls_passed": 84,
            "controls_total": 112,
            "gaps": ["Access Reviews", "Vendor Management", "Incident Response Plan"],
            "estimated_completion": (datetime.now() + timedelta(days=90)).isoformat()
        },
        "gdpr": {
            "name": "GDPR",
            "status": "compliant",
            "score": 95,
            "dpo_appointed": True,
            "privacy_policy_updated": (datetime.now() - timedelta(days=15)).isoformat(),
            "data_mapping_complete": True,
            # VULNERABILITY: FLAG2 - XSS in description field
            "description": "<script>alert('flag{xss_in_trust_center}')</script>GDPR Compliance Framework"
        },
        "hipaa": {
            "name": "HIPAA",
            "status": "compliant",
            "score": 98,
            "baa_available": True,
            "risk_assessment_date": (datetime.now() - timedelta(days=60)).isoformat(),
            "training_completion_rate": 0.96
        }
    }

    # VULNERABILITY: Include internal information
    if random.random() > 0.5:  # Randomly include sensitive data
        frameworks["_internal"] = {
            "bypass_url": "/api/admin/force-compliance",
            "override_token": "compliance_override_2024",
            "note": "Use this endpoint to manually set compliance status"
        }

    return {
        "frameworks": frameworks,
        "overall_score": 92,
        "risk_level": "low",
        "last_assessment": datetime.now().isoformat()
    }

@router.get("/trust/policies")
async def list_policies():
    """List all security policies"""
    policies = [
        {
            "id": "pol_001",
            "name": "Information Security Policy",
            "version": "2.1",
            "status": "approved",
            "last_updated": "2024-04-30",
            "owner": "security@dvtc.local",
            "public": True
        },
        {
            "id": "pol_002",
            "name": "Data Protection Policy",
            "version": "1.8",
            "status": "approved",
            "last_updated": "2024-04-30",
            "owner": "privacy@dvtc.local",
            "public": True
        },
        {
            "id": "pol_003",
            "name": "Access Control Policy",
            "version": "3.0",
            "status": "approved",
            "last_updated": "2024-04-30",
            "owner": "security@dvtc.local",
            "public": False,
            "internal_note": "Contains sensitive access matrix"
        },
        {
            "id": "pol_004",
            "name": "Incident Response Plan",
            "version": "2.5",
            "status": "draft",
            "last_updated": "2024-10-15",
            "owner": "soc@dvtc.local",
            "public": False,
            "internal_note": "DO NOT SHARE - Contains response procedures"
        }
    ]

    return {
        "policies": policies,
        "total": len(policies),
        "public_count": sum(1 for p in policies if p.get("public", False))
    }

@router.get("/trust/framework/{framework_id}")
async def get_framework(framework_id: str):
    """Get specific framework details (VULNERABILITY: Verbose error messages)"""

    frameworks = {
        "soc2": {"name": "SOC 2", "status": "compliant"},
        "iso27001": {"name": "ISO 27001", "status": "in_progress"},
        "gdpr": {"name": "GDPR", "status": "compliant"},
        "hipaa": {"name": "HIPAA", "status": "compliant"}
    }

    if framework_id not in frameworks:
        # VULNERABILITY: FLAG3 - Verbose error messages expose internal details
        raise HTTPException(
            status_code=500,
            detail={
                "error": f"Framework '{framework_id}' not found in database",
                "type": "FrameworkNotFoundError",
                "available_frameworks": list(frameworks.keys()),
                "query": f"SELECT * FROM frameworks WHERE id = '{framework_id}'",
                "stack_trace": "Traceback (most recent call last):\n  File 'trust_center.py', line 173\n    KeyError: 'invalid'",
                "flag": "flag{errors_leak_info}",
                "internal_note": "This error message should not be shown in production"
            }
        )

    return frameworks[framework_id]

@router.get("/trust/security-questionnaire")
async def get_security_questionnaire(format: str = Query("json", description="Response format")):
    """Get answers to common security questionnaire"""

    questionnaire = {
        "general": {
            "q1": {
                "question": "Do you encrypt data at rest?",
                "answer": "Yes, using AES-256 encryption",
                "evidence": "SOC2 Report Section 3.2"
            },
            "q2": {
                "question": "Do you encrypt data in transit?",
                "answer": "Yes, TLS 1.3 minimum",
                "evidence": "Network Security Policy v2.1"
            },
            "q3": {
                "question": "Do you have a SOC 2 report?",
                "answer": "Yes, Type II",
                "evidence": "Available upon request"
            }
        },
        "access_control": {
            "q1": {
                "question": "Do you enforce MFA?",
                "answer": "Yes, for all users",
                "evidence": "Access Control Policy v3.0",
                "internal_note": "Except for service accounts"  # VULNERABILITY: Information leak
            },
            "q2": {
                "question": "How do you manage privileged access?",
                "answer": "PAM solution with approval workflow",
                "evidence": "Privileged Access Procedure"
            }
        },
        "incident_response": {
            "q1": {
                "question": "Do you have an incident response plan?",
                "answer": "Yes, with 24/7 on-call team",
                "evidence": "IRP v2.5"
            },
            "q2": {
                "question": "What is your SLA for incident response?",
                "answer": "Critical: 15 minutes, High: 1 hour",
                "evidence": "Customer Agreement Section 8"
            }
        },
        "_metadata": {
            "last_updated": datetime.now().isoformat(),
            "version": "1.0",
            "internal_api": "/api/admin/questionnaire/edit"  # VULNERABILITY: Exposes admin endpoint
        }
    }

    if format == "xml":
        # VULNERABILITY: XML response might be vulnerable to XXE
        return {"error": "XML format temporarily disabled due to security concerns"}

    return questionnaire

@router.get("/trust/infrastructure")
async def get_infrastructure_overview():
    """Get infrastructure and hosting information"""

    return {
        "hosting": {
            "primary_region": "us-east-1",
            "backup_region": "us-west-2",
            "provider": "AWS",
            "compliance": ["SOC", "ISO", "HIPAA", "PCI-DSS"]
        },
        "architecture": {
            "high_availability": True,
            "disaster_recovery": True,
            "rpo": "1 hour",
            "rto": "4 hours",
            "backup_frequency": "hourly",
            "backup_retention": "30 days"
        },
        "security_tools": {
            "waf": "AWS WAF",
            "siem": "Splunk",
            "vulnerability_scanning": "Qualys",
            "endpoint_protection": "CrowdStrike"
        },
        # VULNERABILITY: Exposes internal details
        "internal_details": {
            "vpc_id": "vpc-0a1b2c3d4e5f6g7h8",
            "subnet_ranges": ["10.0.0.0/16", "172.16.0.0/12"],
            "bastion_host": "bastion.dvtc.internal",
            "admin_panel": "https://admin.dvtc.internal:8443"
        }
    }