# Azure OpenAI Chat Application

A modern chat web application that integrates with Azure OpenAI services and deploys to Azure Kubernetes Service (AKS).

![Azure OpenAI Chat Application](https://raw.githubusercontent.com/microsoft/Web-Dev-For-Beginners/main/1-getting-started-lessons/images/azure-openai.png)

## Features

- Elegant, responsive UI built with React and Material-UI
- Real-time conversation with Azure OpenAI's GPT-4o-mini model
- Full conversation history maintained throughout the session
- Code syntax highlighting for technical discussions
- Markdown rendering for rich text responses
- Containerized application for consistent deployment
- Kubernetes deployment ready for AKS

## Project Structure

```
├── terraform/             # Infrastructure as Code for Azure resources
│   ├── acr.tf             # Azure Container Registry configuration
│   ├── main.tf            # Primary Terraform configuration for AKS
│   └── variables.tf       # Terraform variables
│
└── web-app/               # Web application code
    ├── client/            # React frontend
    │   ├── public/        # Static assets
    │   └── src/           # React source code
    │       └── components/# React components
    ├── kubernetes/        # Kubernetes deployment manifests
    │   ├── deployment.yaml# Deployment configuration
    │   ├── service.yaml   # Service configuration 
    │   └── secrets.yaml   # Secrets for Azure OpenAI credentials
    ├── server.js          # Node.js/Express backend
    ├── .env               # Environment variables (not checked into version control)
    ├── Dockerfile         # Multi-stage Docker build configuration
    ├── deploy.ps1         # PowerShell deployment script
    └── deploy.sh          # Bash deployment script
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Terraform](https://www.terraform.io/downloads.html)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- An Azure subscription with access to Azure OpenAI

## Quick Start

### Local Development

1. Clone this repository
2. Configure environment variables:
   ```
   cd web-app
   cp .env.example .env
   # Edit .env with your Azure OpenAI API Key and endpoint
   ```
3. Install dependencies and run the application:
   ```
   npm install
   npm run build
   npm start
   ```
4. Open http://localhost:3000 in your browser

### Docker Development

```
cd web-app
docker build -t azure-openai-chat .
docker run -p 3000:3000 --env-file .env azure-openai-chat
```

## Deployment to AKS

The project includes automated deployment scripts for Windows (PowerShell) and Linux/macOS (Bash).

### Windows Deployment

```
cd web-app
.\deploy.ps1
```

### Linux/macOS Deployment

```
cd web-app
chmod +x deploy.sh
./deploy.sh
```

The deployment scripts will:
1. Retrieve ACR and AKS information from Terraform outputs
2. Log in to your Azure Container Registry
3. Build and push the Docker image
4. Update Kubernetes manifests with the correct image name
5. Apply the Kubernetes configurations to your AKS cluster
6. Display information about the deployed service

## Infrastructure

The application's infrastructure is managed through Terraform:

- `terraform/main.tf`: Provisions the Azure Kubernetes Service (AKS)
- `terraform/acr.tf`: Sets up Azure Container Registry (ACR) and grants AKS pull access

## Security Notes

- The application uses a `.env` file for local development which is not checked into version control
- For production use, consider implementing Azure Key Vault integration
- Kubernetes Secrets are used to store the Azure OpenAI API key and endpoint in the cluster

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
