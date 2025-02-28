# PowerShell script for deploying to AKS from Windows

# Navigate to terraform directory to get outputs
Push-Location -Path "..\terraform"

# Get ACR and AKS information from Terraform outputs
$ACR_LOGIN_SERVER = terraform output -raw acr_login_server
$ACR_USERNAME = terraform output -raw acr_admin_username
$ACR_PASSWORD = terraform output -raw acr_admin_password
$RESOURCE_GROUP = terraform output -raw resource_group_name
$CLUSTER_NAME = terraform output -raw cluster_name

# Return to web-app directory
Pop-Location

Write-Host "Getting AKS credentials..." -ForegroundColor Cyan
az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --overwrite-existing

Write-Host "Logging into ACR..." -ForegroundColor Cyan
docker login $ACR_LOGIN_SERVER -u $ACR_USERNAME -p $ACR_PASSWORD

Write-Host "Building Docker image..." -ForegroundColor Cyan
docker build -t "$ACR_LOGIN_SERVER/azure-openai-chat:latest" .

Write-Host "Pushing Docker image to ACR..." -ForegroundColor Cyan
docker push "$ACR_LOGIN_SERVER/azure-openai-chat:latest"

Write-Host "Updating deployment manifest with ACR login server..." -ForegroundColor Cyan
(Get-Content -Path "kubernetes\deployment.yaml") -replace '\${ACR_LOGIN_SERVER}', $ACR_LOGIN_SERVER | Set-Content -Path "kubernetes\deployment.yaml"

Write-Host "Applying Kubernetes manifests..." -ForegroundColor Cyan
kubectl apply -f kubernetes\secrets.yaml
kubectl apply -f kubernetes\deployment.yaml
kubectl apply -f kubernetes\service.yaml

Write-Host "Deployment complete! Waiting for external IP..." -ForegroundColor Green
kubectl get service azure-openai-chat -w