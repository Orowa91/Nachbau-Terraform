// Configure the Google Cloud provider

variable "project_name" {
  type = string
}

variable "region" {
  type = string
}

variable "zone" {
  type = number
}

variable "ssh_username" {
  type = number
}

variable "ssh_pub_key_path" {
  type = string
}

variable "google_credentials" {
  type = string
}

provider "hetzner" {
 credentials = var.google_credentials
 region      = var.region
}
