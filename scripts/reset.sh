#!/bin/bash

# DVTC Workshop Reset Script
# This script resets the CTF state without rebuilding containers
# Perfect for workshops and training sessions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}    DVTC Workshop Reset Script${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Function to check if services are running
check_services() {
    echo -e "${YELLOW}Checking services...${NC}"

    if ! docker compose ps | grep -q "dvtc-backend.*running"; then
        echo -e "${RED}Backend service is not running. Please run 'make up' first.${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ All services are running${NC}"
}

# Function to reset scoreboard
reset_scoreboard() {
    echo -e "${YELLOW}Resetting CTF scoreboard...${NC}"

    # Remove scoreboard file from backend container
    docker compose exec -T backend bash -c "rm -f /tmp/scoreboard.json" 2>/dev/null || true

    # Create fresh scoreboard
    docker compose exec -T backend bash -c 'echo "{\"submissions\": [], \"teams\": {}}" > /tmp/scoreboard.json'

    echo -e "${GREEN}✓ Scoreboard reset${NC}"
}

# Function to reset badge states
reset_badges() {
    echo -e "${YELLOW}Resetting badge states...${NC}"

    # Reset badges by restarting backend (state is in memory)
    docker compose restart backend > /dev/null 2>&1

    # Wait for backend to be healthy
    sleep 3

    echo -e "${GREEN}✓ Badge states reset${NC}"
}

# Function to clear application logs
clear_logs() {
    echo -e "${YELLOW}Clearing application logs...${NC}"

    # Clear backend logs
    docker compose exec -T backend bash -c "
        find /tmp -name '*.log' -delete 2>/dev/null || true
        > /var/log/uvicorn.log 2>/dev/null || true
    " || true

    # Clear frontend logs
    docker compose exec -T frontend sh -c "
        > /var/log/next.log 2>/dev/null || true
    " || true

    echo -e "${GREEN}✓ Logs cleared${NC}"
}

# Function to reset AI conversation history
reset_ai_history() {
    echo -e "${YELLOW}Resetting AI conversation history...${NC}"

    # The AI conversations are stored in memory, so restart backend
    # (Already done in reset_badges, but making it explicit)

    echo -e "${GREEN}✓ AI conversation history cleared${NC}"
}

# Function to show current status
show_status() {
    echo ""
    echo -e "${BLUE}Current Status:${NC}"

    # Check scoreboard
    score_count=$(docker compose exec -T backend python -c "
import json
try:
    with open('/tmp/scoreboard.json', 'r') as f:
        data = json.load(f)
        print(len(data.get('submissions', [])))
except:
    print('0')
" 2>/dev/null || echo "0")

    echo -e "  Scoreboard submissions: ${score_count}"

    # Check services health
    backend_health=$(curl -s http://localhost:8000/health 2>/dev/null | grep -q "healthy" && echo "✓ Healthy" || echo "✗ Down")
    echo -e "  Backend status: ${backend_health}"

    frontend_health=$(curl -s http://localhost:3001 2>/dev/null | grep -q "DVTC" && echo "✓ Healthy" || echo "✗ Down")
    echo -e "  Frontend status: ${frontend_health}"
}

# Main execution
main() {
    echo -e "${YELLOW}This will reset the CTF state. Continue? (y/N)${NC}"
    read -r confirm

    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo -e "${RED}Reset cancelled.${NC}"
        exit 0
    fi

    echo ""

    # Check services are running
    check_services

    # Perform reset operations
    reset_scoreboard
    reset_badges
    clear_logs
    reset_ai_history

    # Show final status
    show_status

    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}    Workshop Reset Complete!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo -e "${BLUE}Access points:${NC}"
    echo "  Frontend:   http://localhost:3001"
    echo "  Backend:    http://localhost:8000"
    echo ""
    echo -e "${YELLOW}CTF is ready for participants!${NC}"
}

# Handle script arguments
if [[ "$1" == "--force" ]] || [[ "$1" == "-f" ]]; then
    echo -e "${YELLOW}Force mode enabled - skipping confirmation${NC}"
    check_services
    reset_scoreboard
    reset_badges
    clear_logs
    reset_ai_history
    show_status
    echo -e "${GREEN}Reset complete!${NC}"
elif [[ "$1" == "--status" ]] || [[ "$1" == "-s" ]]; then
    show_status
elif [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]]; then
    echo "DVTC Workshop Reset Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --force, -f    Skip confirmation prompt"
    echo "  --status, -s   Show current system status"
    echo "  --help, -h     Show this help message"
    echo ""
    echo "This script resets the CTF state without rebuilding containers."
    echo "Perfect for workshops and training sessions."
else
    main
fi
