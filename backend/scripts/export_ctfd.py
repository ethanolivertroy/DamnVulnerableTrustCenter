#!/usr/bin/env python3
"""
Export DVTC flags to CTFd format
This script converts flags.json to CTFd-compatible import format
"""

import json
import os
import sys
from datetime import datetime

def load_flags():
    """Load flags from the data file"""
    flags_path = "/app/app/data/flags.json"

    # Fallback for local development
    if not os.path.exists(flags_path):
        flags_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app", "data", "flags.json")

    try:
        with open(flags_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: flags.json not found at {flags_path}")
        sys.exit(1)

def convert_to_ctfd(flags):
    """Convert DVTC flags to CTFd format"""

    ctfd_export = {
        "meta": {
            "version": "v3.5.0",
            "exported_at": datetime.now().isoformat(),
            "ctf_name": "Damn Vulnerable Trust Center (DVTC)",
            "ctf_description": "Intentionally vulnerable trust center platform for security education"
        },
        "challenges": [],
        "hints": [],
        "flags": []
    }

    # Category mapping for better organization
    category_descriptions = {
        "Cloud Storage": "Vulnerabilities in S3 and cloud storage configurations",
        "IAM/Secrets": "Identity and access management weaknesses",
        "Serverless": "Lambda and API Gateway security issues",
        "OSINT/Metadata": "Information disclosure through metadata",
        "Frontend Logic": "Client-side security vulnerabilities",
        "Supply Chain": "CI/CD and dependency vulnerabilities",
        "API Auth": "Authentication and authorization flaws",
        "AI Security": "AI/ML security issues including prompt injection",
        "Source Control": "Git and version control vulnerabilities",
        "Business Logic": "Application logic flaws",
        "Information Disclosure": "Debug and info leak vulnerabilities",
        "Authentication": "Authentication mechanism weaknesses",
        "Crypto/Config": "Cryptographic and configuration issues"
    }

    for idx, flag in enumerate(flags):
        challenge_id = idx + 1

        # Create challenge entry
        challenge = {
            "id": challenge_id,
            "name": flag["title"],
            "description": f"{flag['description']}\n\n**Evidence Required:** {flag.get('evidence', 'Submit the flag')}\n\n**Verification:** {flag.get('verification', 'Submit the correct flag string')}",
            "category": flag["category"],
            "value": flag["points"],
            "type": "standard",
            "state": "visible",
            "requirements": None,
            "max_attempts": 0,  # Unlimited attempts
            "files": [],
            "tags": [],
            "hints": []
        }

        # Add category description as a tag
        if flag["category"] in category_descriptions:
            challenge["tags"].append({
                "value": category_descriptions[flag["category"]]
            })

        ctfd_export["challenges"].append(challenge)

        # Create flag entry
        flag_entry = {
            "id": challenge_id,
            "challenge_id": challenge_id,
            "type": "static",
            "content": flag["flag"],
            "data": None
        }
        ctfd_export["flags"].append(flag_entry)

        # Create hint entries
        for hint_idx, hint_text in enumerate(flag.get("hints", [])):
            hint = {
                "id": len(ctfd_export["hints"]) + 1,
                "challenge_id": challenge_id,
                "type": "standard",
                "content": hint_text,
                "cost": (hint_idx + 1) * 10,  # Progressive hint costs
                "requirements": None
            }
            ctfd_export["hints"].append(hint)

    # Add additional CTFd configuration
    ctfd_export["config"] = {
        "ctf_name": "DVTC CTF",
        "ctf_description": "Damn Vulnerable Trust Center - Educational CTF for trust center security",
        "ctf_theme": "core",
        "user_mode": "teams",
        "challenge_visibility": "public",
        "score_visibility": "public",
        "registration_visibility": "public",
        "verify_emails": False,
        "team_size": 4,
        "hide_scores": False,
        "freeze_time": None,
        "start_time": datetime.now().isoformat(),
        "end_time": None
    }

    # Add pages for CTFd
    ctfd_export["pages"] = [
        {
            "id": 1,
            "title": "Rules",
            "route": "rules",
            "content": """# DVTC CTF Rules

## Overview
The Damn Vulnerable Trust Center (DVTC) is an educational CTF designed to teach security vulnerabilities in trust center platforms.

## Rules
1. **No Brute Force**: Do not brute force flags or endpoints
2. **No DoS**: Do not attempt to crash or overload services
3. **Stay In Scope**: Only target the DVTC application
4. **Share Knowledge**: Help others learn, but don't share flags directly
5. **Have Fun**: This is for education - enjoy learning!

## Flag Format
All flags follow the format: `flag{...}`

## Categories
- Cloud Storage
- IAM/Secrets
- Serverless
- OSINT/Metadata
- Frontend Logic
- Supply Chain
- API Auth
- AI Security
- And more!

## Support
If you find issues with challenges, please notify the organizers.""",
            "draft": False,
            "hidden": False,
            "auth_required": False
        },
        {
            "id": 2,
            "title": "Setup",
            "route": "setup",
            "content": """# DVTC Setup Guide

## Local Setup
1. Clone the DVTC repository
2. Run `docker-compose up --build`
3. Access the application at http://localhost:3000
4. Backend API at http://localhost:8000
5. LocalStack at http://localhost:4566

## Tools Recommended
- Browser Developer Tools
- Burp Suite or OWASP ZAP
- AWS CLI (configured for LocalStack)
- curl or httpie
- Python for scripting

## Getting Started
1. Visit the main page and explore the UI
2. Check `/api/docs` for API documentation
3. Look for machine-readable feeds
4. Test authentication endpoints
5. Explore the CTF page for challenge list

Happy Hacking!""",
            "draft": False,
            "hidden": False,
            "auth_required": False
        }
    ]

    # Add notifications
    ctfd_export["notifications"] = [
        {
            "id": 1,
            "title": "Welcome to DVTC CTF!",
            "content": "The Damn Vulnerable Trust Center CTF is now live. Check the Rules and Setup pages to get started. Remember: this is for education - help others learn!",
            "date": datetime.now().isoformat(),
            "type": "toast"
        }
    ]

    return ctfd_export

def main():
    """Main export function"""
    print("DVTC CTFd Export Script")
    print("=" * 50)

    # Load flags
    print("Loading flags from flags.json...")
    flags = load_flags()
    print(f"Found {len(flags)} flags")

    # Convert to CTFd format
    print("Converting to CTFd format...")
    ctfd_data = convert_to_ctfd(flags)

    # Output file path
    output_path = "/app/ctfd_export.json"
    if not os.path.exists("/app"):
        output_path = "ctfd_export.json"

    # Write export file
    print(f"Writing export to {output_path}...")
    with open(output_path, "w") as f:
        json.dump(ctfd_data, f, indent=2)

    # Summary
    print("\nExport Summary:")
    print(f"  Challenges: {len(ctfd_data['challenges'])}")
    print(f"  Flags: {len(ctfd_data['flags'])}")
    print(f"  Hints: {len(ctfd_data['hints'])}")
    print(f"  Pages: {len(ctfd_data['pages'])}")
    print("\nCategories included:")
    categories = set(c["category"] for c in ctfd_data["challenges"])
    for cat in sorted(categories):
        count = sum(1 for c in ctfd_data["challenges"] if c["category"] == cat)
        print(f"  - {cat}: {count} challenges")

    print(f"\n✓ Export complete: {output_path}")
    print("\nTo import into CTFd:")
    print("  1. Log into CTFd admin panel")
    print("  2. Go to Admin > Config > Backup")
    print("  3. Click 'Import' and upload ctfd_export.json")
    print("  4. Select import options and confirm")

if __name__ == "__main__":
    main()