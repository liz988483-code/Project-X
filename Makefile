.PHONY: help install setup start stop restart clean build test lint format docker-up docker-down migrate seed deploy backup monitor status security-check

# Colors
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m

DOCKER_COMPOSE=docker-compose
DOCKER_COMPOSE_PROD=docker-compose -f docker-compose.prod.yml
NODE_MODULES=node_modules

# -----------------------
# Help
# -----------------------
help: ## Show this help
	@echo "Soko E-commerce Platform Management"
	@echo
	@echo "Usage: make [target]"
	@echo
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# -----------------------
# Setup & Install
# -----------------------
install: ## Install all dependencies
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	@npm install
	@(cd frontend/web && npm install)
	@(cd frontend/mobile && npm install)
	@(cd backend/api-gateway && npm install)
	@(cd backend/services && for d in */; do cd $$d && npm install && cd ..; done)
	@echo "$(GREEN)Dependencies installed successfully!$(NC)"

setup: ## Setup dev environment
	@echo "$(YELLOW)Setting up development environment...$(NC)"
	@cp .env.example .env
	@docker network create soko-network 2>/dev/null || true
	@echo "$(GREEN)Environment setup complete!$(NC)"
	@echo "$(YELLOW)Please update .env with your credentials$(NC)"

# -----------------------
# Development / Docker
# -----------------------
start: ## Start dev environment
	@echo "$(YELLOW)Starting development services...$(NC)"
	@$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)Services started!$(NC)"

stop: ## Stop all services
	@echo "$(YELLOW)Stopping services...$(NC)"
	@$(DOCKER_COMPOSE) down
	@echo "$(GREEN)Services stopped!$(NC)"

restart: stop start ## Restart all services

docker-up: start ## Alias
docker-down: stop ## Alias

# -----------------------
# Build / Deploy
# -----------------------
build: ## Build services for production
	@echo "$(YELLOW)Building for production...$(NC)"
	@$(DOCKER_COMPOSE_PROD) build
	@echo "$(GREEN)Build complete!$(NC)"

deploy: build ## Deploy to production
	@echo "$(YELLOW)Deploying...$(NC)"
	@$(DOCKER_COMPOSE_PROD) up -d
	@echo "$(GREEN)Deployment complete!$(NC)"

# -----------------------
# Migrations / Seed
# -----------------------
migrate: ## Run migrations
	@echo "$(YELLOW)Running migrations...$(NC)"
	@(cd backend/services && for d in */; do cd $$d && npm run migrate || true; cd ..; done)
	@echo "$(GREEN)Migrations completed!$(NC)"

seed: ## Seed database
	@echo "$(YELLOW)Seeding databases...$(NC)"
	@(cd backend/services && for d in */; do cd $$d && npm run seed || true; cd ..; done)
	@echo "$(GREEN)Database seeded!$(NC)"

backup: ## Backup DBs
	@echo "$(YELLOW)Backing up databases...$(NC)"
	@mkdir -p backups/$(shell date +%Y%m%d)
	@docker exec soko-postgres pg_dump -U postgres soko_users > backups/$(shell date +%Y%m%d)/users.sql
	@docker exec soko-mongodb mongodump --out backups/$(shell date +%Y%m%d)/mongodb
	@echo "$(GREEN)Backup completed!$(NC)"

# -----------------------
# Logs / Monitoring
# -----------------------
logs: ## Tail logs from all services
	@$(DOCKER_COMPOSE) logs -f

logs-frontend:
	@$(DOCKER_COMPOSE) logs -f frontend

logs-backend:
	@$(DOCKER_COMPOSE) logs -f api-gateway

logs-db:
	@$(DOCKER_COMPOSE) logs -f postgres mongodb redis

monitor: ## Open monitoring dashboard
	@echo "$(YELLOW)Opening monitoring dashboard...$(NC)"
	@open http://localhost:3000/dashboard || xdg-open http://localhost:3000/dashboard || echo "Open http://localhost:3000/dashboard manually"

status: ## Service status & resources
	@echo "$(YELLOW)Service Status:$(NC)"
	@$(DOCKER_COMPOSE) ps
	@echo
	@echo "$(YELLOW)Container Resources:$(NC)"
	@docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -10

# -----------------------
# Code Quality
# -----------------------
lint: ## Run linting
	@echo "$(YELLOW)Linting code...$(NC)"
	@npm run lint
	@(cd frontend/web && npm run lint)
	@(cd backend/api-gateway && npm run lint)
	@echo "$(GREEN)Linting complete!$(NC)"

format: ## Format code
	@echo "$(YELLOW)Formatting code...$(NC)"
	@npm run format
	@(cd frontend/web && npm run format)
	@(cd backend/api-gateway && npm run format)
	@echo "$(GREEN)Formatting complete!$(NC)"

security-check: ## Run security audits
	@echo "$(YELLOW)Running security checks...$(NC)"
	@npm audit
	@(cd frontend/web && npm audit)
	@(cd backend/api-gateway && npm audit)
	@echo "$(GREEN)Security checks completed!$(NC)"

# -----------------------
# Testing
# -----------------------
test: ## Run all tests
	@echo "$(YELLOW)Running tests...$(NC)"
	@npm test
	@(cd frontend/web && npm test)
	@(cd backend/api-gateway && npm test)
	@echo "$(GREEN)Tests completed!$(NC)"

test-unit:
	@echo "$(YELLOW)Running unit tests...$(NC)"
	@npm run test:unit

test-integration:
	@echo "$(YELLOW)Running integration tests...$(NC)"
	@npm run test:integration

test-e2e:
	@echo "$(YELLOW)Running E2E tests...$(NC)"
	@npm run test:e2e
