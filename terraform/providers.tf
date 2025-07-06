terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.67.0"
    }
  }
}
 
provider "google" {
  # Configuration options
  # project id
  project = "brlcto-btaasgcp"
 
  #project region & zone
  region = "us-central1"
  zone = "us-central1-a"
}
