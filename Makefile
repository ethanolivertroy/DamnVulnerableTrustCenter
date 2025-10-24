.PHONY: help up down build clean logs seed reset test flags init

# Colors for terminal output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Show this help message
	@echo "Damn Vulnerable Trust Center (DVTC) - Makefile Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Start all services with docker compose
	@echo "$(GREEN)Starting DVTC services...$(NC)"
	docker compose up --build -d
	@echo "$(GREEN)Services started successfully!$(NC)"
	@echo ""
	@echo "$(YELLOW)Access points:$(NC)"
	@echo "  Frontend:   http://localhost:3000"
	@echo "  Backend:    http://localhost:8000"
	@echo "  LocalStack: http://localhost:4566"
	@echo ""

down: ## Stop all services
	@echo "$(YELLOW)Stopping DVTC services...$(NC)"
	docker compose down
	@echo "$(GREEN)Services stopped.$(NC)"

build: ## Rebuild all containers
	@echo "$(GREEN)Building DVTC containers...$(NC)"
	docker compose build --no-cache

clean: ## Stop services and remove volumes
	@echo "$(RED)Cleaning up DVTC...$(NC)"
	docker compose down -v
	rm -rf frontend/node_modules frontend/.next
	rm -rf backend/__pycache__
	@echo "$(GREEN)Cleanup complete.$(NC)"

logs: ## Tail logs from all services
	docker compose logs -f

backend-logs: ## Tail backend logs
	docker compose logs -f backend

frontend-logs: ## Tail frontend logs
	docker compose logs -f frontend

localstack-logs: ## Tail LocalStack logs
	docker compose logs -f localstack

seed: ## Re-run LocalStack seed scripts
	@echo "$(GREEN)Re-seeding LocalStack resources...$(NC)"
	docker compose exec localstack bash -c "for script in /etc/localstack/init/ready.d/*.sh; do bash \$$script; done"
	@echo "$(GREEN)Seeding complete.$(NC)"

reset: ## Reset CTF state (clears scoreboard, resets flags)
	@echo "$(YELLOW)Resetting CTF state...$(NC)"
	docker compose exec backend python -c "import os; os.remove('/tmp/scoreboard.json') if os.path.exists('/tmp/scoreboard.json') else None"
	docker compose restart backend
	@echo "$(GREEN)CTF state reset.$(NC)"

test: ## Run tests for backend and frontend
	@echo "$(GREEN)Running tests...$(NC)"
	docker compose exec backend pytest
	docker compose exec frontend npm test

flags: ## Show all CTF flag titles (no spoilers)
	@echo "$(YELLOW)Available CTF Flags:$(NC)"
	@docker compose exec backend python -c "import json; flags = json.load(open('/app/app/data/flags.json')); [print(f\"{f['id']}: {f['title']} ({f['points']} pts)\") for f in flags]" 2>/dev/null || echo "Backend not running. Start with 'make up' first."

init: ## Initialize project (copy .env, install deps)
	@echo "$(GREEN)Initializing DVTC project...$(NC)"
	@if [ ! -f .env ]; then cp .env.example .env && echo "Created .env file"; fi
	@echo "$(GREEN)Initialization complete. Run 'make up' to start.$(NC)"

health: ## Check health of all services
	@echo "$(YELLOW)Checking service health...$(NC)"
	@curl -s http://localhost:3000 > /dev/null 2>&1 && echo "$(GREEN)✓ Frontend is healthy$(NC)" || echo "$(RED)✗ Frontend is down$(NC)"
	@curl -s http://localhost:8000/health > /dev/null 2>&1 && echo "$(GREEN)✓ Backend is healthy$(NC)" || echo "$(RED)✗ Backend is down$(NC)"
	@curl -s http://localhost:4566/_localstack/health > /dev/null 2>&1 && echo "$(GREEN)✓ LocalStack is healthy$(NC)" || echo "$(RED)✗ LocalStack is down$(NC)"

workshop: ## Prepare for workshop mode (scales services)
	@echo "$(YELLOW)Preparing workshop mode...$(NC)"
	docker compose up --scale frontend=3 --scale backend=2 -d
	@echo "$(GREEN)Workshop mode enabled with scaled services.$(NC)"

export-ctfd: ## Export flags for CTFd platform
	@echo "$(YELLOW)Exporting flags for CTFd...$(NC)"
	docker compose exec backend python /app/scripts/export_ctfd.py
	@echo "$(GREEN)CTFd export complete: ctfd_export.json$(NC)"

shell-backend: ## Open shell in backend container
	docker compose exec backend bash

shell-frontend: ## Open shell in frontend container
	docker compose exec frontend sh

shell-localstack: ## Open shell in LocalStack container
	docker compose exec localstack bash
