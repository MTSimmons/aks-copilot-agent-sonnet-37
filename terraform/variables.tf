variable "resource_group_name" {
  description = "Resource group name for AKS demo"
  type        = string
  default     = "aks-demo-rg"
}

variable "location" {
  description = "Azure region to deploy resources"
  type        = string
  default     = "eastus"
}

variable "cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
  default     = "aks-demo-cluster"
}

variable "node_count" {
  description = "Number of nodes in the AKS cluster"
  type        = number
  default     = 2
}

variable "vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_D2s_v3"  # 2 cores, 8 GB RAM
}

variable "environment" {
  description = "Environment name for tagging"
  type        = string
  default     = "demo"
}

variable "prefix" {
  description = "Prefix for resource naming"
  type        = string
  default     = "aksdemo"
}