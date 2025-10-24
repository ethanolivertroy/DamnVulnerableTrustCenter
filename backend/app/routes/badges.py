from fastapi import APIRouter, HTTPException, Query, Header
from fastapi.responses import JSONResponse
from typing import Dict, Optional
import json
from datetime import datetime

router = APIRouter()

# In-memory badge state (VULNERABILITY: Can be manipulated)
BADGE_STATE = {
    "soc2_compliant": {
        "status": "ok",
        "label": "SOC 2 Type II",
        "color": "green",
        "verified": True,
        "last_audit": "2024-01-15"
    },
    "iso27001": {
        "status": "in_progress",
        "label": "ISO 27001",
        "color": "yellow",
        "verified": False,
        "expected": "2024-12-31"
    },
    "gdpr_ready": {
        "status": "ok",
        "label": "GDPR Compliant",
        "color": "green",
        "verified": True,
        "dpo_appointed": True
    },
    "hipaa_compliant": {
        "status": "ok",
        "label": "HIPAA Compliant",
        "color": "green",
        "verified": True,
        "baa_available": True
    },
    "fips_encryption": {
        "status": "false",
        "label": "FIPS 140-2",
        "color": "red",
        "verified": False,
        "reason": "Module not enabled",
        # VULNERABILITY: Can be overridden client-side
        "client_override_allowed": True
    },
    "pen_tested": {
        "status": "warning",
        "label": "Penetration Tested",
        "color": "orange",
        "verified": True,
        "last_test": "2023-01-01",  # VULNERABILITY: Old pentest
        "findings": "3 critical, 7 high"
    }
}

@router.get("/")
async def get_badges(
    format: str = Query("json", description="Response format"),
    include_internal: bool = Query(False, description="Include internal badges")
):
    """Get current badge states"""

    badges = BADGE_STATE.copy()

    # VULNERABILITY: Expose internal badges with parameter
    if include_internal:
        badges["debug_mode"] = {
            "status": "enabled",
            "label": "Debug Mode",
            "color": "red",
            "warning": "Debug mode is enabled in production!"
        }
        badges["api_keys_rotated"] = {
            "status": "overdue",
            "label": "API Key Rotation",
            "color": "red",
            "last_rotation": "2022-01-01",
            "days_overdue": 700
        }

    if format == "shields":
        # Return in shields.io format
        shields_badges = {}
        for key, badge in badges.items():
            shields_badges[key] = {
                "schemaVersion": 1,
                "label": badge["label"],
                "message": badge["status"],
                "color": badge["color"]
            }
        return shields_badges

    return {
        "badges": badges,
        "last_updated": datetime.now().isoformat(),
        "total_badges": len(badges),
        "compliant_count": sum(1 for b in badges.values() if b["status"] == "ok"),
        "warnings_count": sum(1 for b in badges.values() if b["status"] in ["warning", "false"]),
        # VULNERABILITY: Hint about client-side manipulation
        "client_note": "Some badges can be overridden via window.__BADGES_OVERRIDE"
    }

@router.post("/override")
async def override_badge(
    badge_id: str,
    new_status: str,
    authorization: Optional[str] = Header(None)
):
    """Override badge status (VULNERABILITY: Weak auth)"""

    # VULNERABILITY: Weak authorization check
    if authorization != "Bearer admin_badge_token_2024":
        # But still allow certain badges to be changed
        if badge_id == "fips_encryption":
            # VULNERABILITY: FIPS badge can be changed without auth
            BADGE_STATE[badge_id]["status"] = new_status
            BADGE_STATE[badge_id]["color"] = "green" if new_status == "ok" else "red"
            return {
                "success": True,
                "badge_id": badge_id,
                "new_status": new_status,
                "flag": "flag{ui_state_is_not_security}" if new_status == "ok" else None
            }
        else:
            raise HTTPException(status_code=403, detail="Authorization required")

    if badge_id not in BADGE_STATE:
        raise HTTPException(status_code=404, detail="Badge not found")

    # Update badge
    BADGE_STATE[badge_id]["status"] = new_status
    BADGE_STATE[badge_id]["color"] = "green" if new_status == "ok" else "red"
    BADGE_STATE[badge_id]["manually_overridden"] = True
    BADGE_STATE[badge_id]["override_timestamp"] = datetime.now().isoformat()

    return {
        "success": True,
        "badge_id": badge_id,
        "new_status": new_status,
        "previous_status": BADGE_STATE[badge_id].get("previous_status"),
        "warning": "Manual override applied - audit trail updated"
    }

@router.get("/{badge_id}")
async def get_badge_details(badge_id: str):
    """Get detailed information about a specific badge"""

    if badge_id not in BADGE_STATE:
        # VULNERABILITY: Error message reveals valid badge IDs
        raise HTTPException(
            status_code=404,
            detail=f"Badge '{badge_id}' not found. Valid badges: {list(BADGE_STATE.keys())}"
        )

    badge = BADGE_STATE[badge_id]

    # Add detailed information
    details = {
        "id": badge_id,
        **badge,
        "verification_details": {
            "last_check": datetime.now().isoformat(),
            "verification_method": "automated" if badge.get("verified") else "manual",
            "evidence_location": f"/api/reports/{badge_id}_evidence.pdf"
        }
    }

    # VULNERABILITY: Expose sensitive information for certain badges
    if badge_id == "fips_encryption":
        details["technical_details"] = {
            "module_version": "OpenSSL 1.0.2 (non-FIPS)",
            "config_location": "/etc/crypto/fips.conf",
            "override_command": "window.__BADGES_OVERRIDE = {fips_encryption: 'ok'}",
            "validation_bypass": True
        }

    return details

@router.get("/verify/{badge_id}")
async def verify_badge(badge_id: str, skip_validation: bool = Query(False)):
    """Verify badge status (VULNERABILITY: Can skip validation)"""

    if badge_id not in BADGE_STATE:
        raise HTTPException(status_code=404, detail="Badge not found")

    # VULNERABILITY: Skip validation parameter
    if skip_validation:
        return {
            "badge_id": badge_id,
            "verified": True,
            "method": "skipped",
            "timestamp": datetime.now().isoformat(),
            "warning": "Validation skipped per request",
            "flag": "flag{compliance_by_css}" if badge_id == "fips_encryption" else None
        }

    # Simulate verification
    badge = BADGE_STATE[badge_id]
    verified = badge.get("verified", False)

    # Fake verification logic
    verification_result = {
        "badge_id": badge_id,
        "verified": verified,
        "method": "automated_check",
        "timestamp": datetime.now().isoformat(),
        "details": {
            "check_performed": f"Validated {badge['label']} status",
            "result": "passed" if verified else "failed",
            "evidence": f"Report available at /api/reports/{badge_id}.pdf"
        }
    }

    return verification_result

@router.post("/bulk-update")
async def bulk_update_badges(updates: Dict[str, str], force: bool = Query(False)):
    """Update multiple badges at once (VULNERABILITY: Can force update)"""

    results = {}
    flags_found = []

    for badge_id, new_status in updates.items():
        if badge_id not in BADGE_STATE:
            results[badge_id] = {"error": "Badge not found"}
            continue

        # VULNERABILITY: Force parameter bypasses validation
        if force or badge_id == "fips_encryption":
            BADGE_STATE[badge_id]["status"] = new_status
            BADGE_STATE[badge_id]["color"] = "green" if new_status == "ok" else "red"
            results[badge_id] = {"success": True, "new_status": new_status}

            # Check for specific vulnerability exploits
            if badge_id == "fips_encryption" and new_status == "ok":
                flags_found.append("flag{ui_state_is_not_security}")
        else:
            results[badge_id] = {"error": "Authorization required"}

    response = {
        "results": results,
        "updated_count": sum(1 for r in results.values() if r.get("success")),
        "timestamp": datetime.now().isoformat()
    }

    if flags_found:
        response["flags"] = flags_found

    return response