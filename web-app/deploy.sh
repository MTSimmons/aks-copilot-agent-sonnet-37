#!/bin/bash

# Exit on any error
set -e

# Get ACR login server from Terraform output
ACR_LOGIN_SERVER=$(cd ../terraform && terraform output -raw acr_login_server)
ACR_USERNAME=$(cd ../terraform && terraform output -raw acr_admin_username)
ACR_PASSWORD=$(cd ../terraform && terraform output -raw acr_admin_password)

# Get AKS credentials
RESOURCE_GROUP=$(cd ../terraform && terraform output -raw resource_group_name)
CLUSTER_NAME=$(cd ../terraform && terraform output -raw cluster_name)

echo "Getting AKS credentials..."
az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --overwrite-existing

echo "Logging into ACR..."
docker login $ACR_LOGIN_SERVER -u $ACR_USERNAME -p $ACR_PASSWORD

echo "Building Docker image..."
docker build -t $ACR_LOGIN_SERVER/azure-openai-chat:latest .

echo "Pushing Docker image to ACR..."
docker push $ACR_LOGIN_SERVER/azure-openai-chat:latest

echo "Updating deployment manifest with ACR login server..."
sed -i "s|\${ACR_LOGIN_SERVER}|$ACR_LOGIN_SERVER|g" kubernetes/deployment.yaml

echo "Applying Kubernetes manifests..."
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

echo "Deployment complete! Waiting for external IP..."
kubectl get service azure-openai-chat -w