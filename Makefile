#!/bin/bash
# zkOrigin: Build, test, and deploy the full stack
# Usage: make [build|test|circuits|deploy|clean]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

CONTRACT_DIR="contracts/zk-origin"
CIRCUITS_DIR="circuits"

.PHONY: build test circuits deploy clean all help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(CYAN)%-18s$(NC) %s\n", $$1, $$2}'

build: ## Build the Soroban contract
	@echo "$(CYAN)Building zkOrigin contract...$(NC)"
	cd $(CONTRACT_DIR) && cargo build --target wasm32-unknown-unknown --release
	@echo "$(GREEN)Build complete$(NC)"
	@ls -lah $(CONTRACT_DIR)/target/wasm32-unknown-unknown/release/*.wasm 2>/dev/null || echo "WASM not found, checking alternative path..."
	@find $(CONTRACT_DIR)/target -name "*.wasm" -exec ls -lah {} \;

test: ## Run contract tests
	@echo "$(CYAN)Running contract tests...$(NC)"
	cd $(CONTRACT_DIR) && cargo test
	@echo "$(GREEN)All tests passed$(NC)"

circuits: ## Compile Noir circuits and generate verification keys
	@echo "$(CYAN)Compiling wallet_age circuit...$(NC)"
	cd $(CIRCUITS_DIR)/wallet_age && nargo compile && nargo execute && nargo check
	@echo "$(CYAN)Compiling kyc_attestation circuit...$(NC)"
	cd $(CIRCUITS_DIR)/kyc_attestation && nargo compile && nargo execute && nargo check
	@echo "$(CYAN)Compiling provenance circuit...$(NC)"
	cd $(CIRCUITS_DIR)/provenance && nargo compile && nargo execute && nargo check
	@echo "$(GREEN)All circuits compiled and tested$(NC)"

circuit-tests: ## Run Noir circuit tests
	@echo "$(CYAN)Testing wallet_age circuit...$(NC)"
	cd $(CIRCUITS_DIR)/wallet_age && nargo test
	@echo "$(CYAN)Testing kyc_attestation circuit...$(NC)"
	cd $(CIRCUITS_DIR)/kyc_attestation && nargo test
	@echo "$(CYAN)Testing provenance circuit...$(NC)"
	cd $(CIRCUITS_DIR)/provenance && nargo test
	@echo "$(GREEN)All circuit tests passed$(NC)"

deploy-testnet: build ## Deploy to Stellar testnet
	@echo "$(CYAN)Deploying to Stellar testnet...$(NC)"
	@echo "Run: stellar contract deploy --wasm $(CONTRACT_DIR)/target/wasm32-unknown-unknown/release/zk_origin.wasm --source <YOUR_KEY> --network testnet"
	@echo "$(GREEN)See scripts/deploy.sh for automated deploy$(NC)"

invoke: ## Invoke contract (requires CONTRACT_ID env var)
	@echo "$(CYAN)Contract ID: $(CONTRACT_ID)$(NC)"
	stellar contract invoke --id $(CONTRACT_ID) --source admin --network testnet -- total_proofs

lint: ## Run linting and formatting
	cd $(CONTRACT_DIR) && cargo fmt --check && cargo clippy -- -D warnings

clean: ## Clean build artifacts
	cd $(CONTRACT_DIR) && cargo clean
	rm -rf target/
	@echo "$(GREEN)Cleaned$(NC)"

full: build test ## Build and test everything
	@echo "$(GREEN)Full build and test complete$(NC)"

all: help ## Default: show help
