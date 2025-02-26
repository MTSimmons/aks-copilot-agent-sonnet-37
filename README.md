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

### 2. Build and Push the Docker Image

```bash
# Navigate to the web-app directory
cd ../web-app

# Build the Docker image
docker build -t openai-chat-app .

# Get ACR details
ACR_NAME=$(cd ../terraform && terraform output -raw acr_login_server)
ACR_USERNAME=$(cd ../terraform && terraform output -raw acr_admin_username)
ACR_PASSWORD=$(cd ../terraform && terraform output -raw acr_admin_password)

# Login to ACR
docker login $ACR_NAME -u $ACR_USERNAME -p $ACR_PASSWORD

# Tag and push the image
docker tag openai-chat-app $ACR_NAME/openai-chat-app:latest
docker push $ACR_NAME/openai-chat-app:latest
```

### 3. Deploy to AKS

```bash
# Update the ACR name in the k8s manifest
export ACR_NAME=$(cd ../terraform && terraform output -raw acr_login_server | cut -d'.' -f1)
envsubst < k8s-deployment.yaml > k8s-deployment-updated.yaml

# Apply the Kubernetes manifests
kubectl apply -f k8s-deployment-updated.yaml

# Get the external IP address of the service
kubectl get service openai-chat-app
```

## Local Development

To run the application locally:

```bash
# Navigate to the web-app directory
cd web-app

# Install dependencies
npm install
cd client && npm install && cd ..

# Run the backend and frontend concurrently
npm run dev
```

## Security Notes

- The API key is stored in a Kubernetes Secret and .env file (for local development).
- The .env file is excluded from version control via .gitignore.
- For production use, consider using Azure Key Vault for secrets management.

## Cleanup

To delete all resources when you're done:

```bash
cd terraform
terraform destroy
```