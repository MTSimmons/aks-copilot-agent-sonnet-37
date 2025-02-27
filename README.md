# Azure AKS OpenAI Chat Demo

This project demonstrates a modern chat application using Azure OpenAI deployed to Azure Kubernetes Service (AKS). The infrastructure is created using Terraform, and the application is containerized and deployed to Kubernetes.

## Architecture

- **Infrastructure**: Azure Kubernetes Service (AKS) and Azure Container Registry (ACR) provisioned via Terraform
- **Web Application**: Node.js Express backend with React frontend
- **AI Integration**: Azure OpenAI for chat completion

## Prerequisites

- Azure subscription
- Azure CLI
- Terraform
- Docker
- kubectl

## Getting Started

### 1. Deploy Infrastructure with Terraform

```bash
# Navigate to the terraform directory
cd terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -out=tfplan

# Apply the deployment
terraform apply tfplan

# Once deployed, get the AKS credentials
az aks get-credentials --resource-group $(terraform output -raw resource_group_name) --name $(terraform output -raw cluster_name)
```
