resource "azurerm_container_registry" "acr" {
  name                = replace(lower("${var.prefix}acr"), "-", "")
  resource_group_name = azurerm_resource_group.aks_rg.name
  location            = azurerm_resource_group.aks_rg.location
  sku                 = "Standard"
  admin_enabled       = true
}

# Assign AcrPull role to the AKS kubelet identity
resource "azurerm_role_assignment" "aks_acr" {
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}

# Output the ACR login server
output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

# Output the ACR admin username
output "acr_admin_username" {
  value = azurerm_container_registry.acr.admin_username
}

# Output the ACR admin password
output "acr_admin_password" {
  value     = azurerm_container_registry.acr.admin_password
  sensitive = true
}