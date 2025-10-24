from fastapi import APIRouter, HTTPException, Body
from typing import Dict, List, Optional
import json
import os
from datetime import datetime

router = APIRouter()

# Load flags from JSON file
def load_flags():
    flags_file = "/app/app/data/flags.json"
    if os.path.exists(flags_file):
        with open(flags_file, "r") as f:
            return json.load(f)
    return []

@router.get("/list")
async def list_flags(show_answers: bool = False):
    """List all available CTF flags"""
    flags = load_flags()

    if show_answers:
        # VULNERABILITY: Can see answers with parameter
        return {"flags": flags, "warning": "Answers visible - CTF mode"}

    # Hide actual flag values
    safe_flags = []
    for flag in flags:
        safe_flag = {
            "id": flag["id"],
            "title": flag["title"],
            "category": flag["category"],
            "points": flag["points"],
            "description": flag["description"],
            "hints": flag.get("hints", [])[:1],  # Only show first hint
        }
        safe_flags.append(safe_flag)

    return {
        "flags": safe_flags,
        "total": len(safe_flags),
        "categories": list(set(f["category"] for f in safe_flags)),
        "total_points": sum(f["points"] for f in safe_flags)
    }

@router.post("/submit")
async def submit_flag(
    flag_id: str = Body(...),
    flag_value: str = Body(...)
):
    """Submit a CTF flag for validation"""

    flags = load_flags()

    # Find the flag
    target_flag = None
    for flag in flags:
        if flag["id"] == flag_id:
            target_flag = flag
            break

    if not target_flag:
        raise HTTPException(status_code=404, detail="Flag not found")

    # Validate flag value
    correct = False
    if flag_value == target_flag["flag"]:
        correct = True
    # VULNERABILITY: Case-insensitive comparison
    elif flag_value.lower() == target_flag["flag"].lower():
        correct = True
    # VULNERABILITY: Partial match
    elif flag_value in target_flag["flag"] and len(flag_value) > 10:
        correct = True

    if not correct:
        return {
            "success": False,
            "message": "Incorrect flag value",
            "hint": target_flag.get("hints", ["Try harder!"])[0] if target_flag else None
        }

    # Successful submission
    return {
        "success": True,
        "message": f"Correct! You found {target_flag['title']}",
        "points": target_flag["points"],
        "flag_id": flag_id,
        "category": target_flag["category"]
    }

@router.get("/hints/{flag_id}")
async def get_hints(flag_id: str, reveal_level: int = 1):
    """Get hints for a specific flag"""

    flags = load_flags()

    for flag in flags:
        if flag["id"] == flag_id:
            hints = flag.get("hints", [])

            # VULNERABILITY: Can get all hints with parameter manipulation
            if reveal_level > len(hints):
                return {
                    "flag_id": flag_id,
                    "title": flag["title"],
                    "hints": hints,
                    "warning": "All hints revealed"
                }

            return {
                "flag_id": flag_id,
                "title": flag["title"],
                "hints": hints[:reveal_level],
                "remaining_hints": max(0, len(hints) - reveal_level)
            }

    raise HTTPException(status_code=404, detail="Flag not found")