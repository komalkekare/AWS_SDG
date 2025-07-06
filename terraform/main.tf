# Data source to fetch existing static IP
data "google_compute_address" "existing_static_ip" {
  name   = "static-ip-address" # Replace with the actual name of the existing static IP
  region = substr(var.zone, 0, length(var.zone) - 2) # Extracts region from zone
}
 
# Firewall rule for SSH
resource "google_compute_firewall" "allow-ssh" {
  name    = "allow-ssh"
  network = "default"
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = ["0.0.0.0/0"]
  target_tags   = [var.compute_instance]
}
 
# Firewall rule for Spring Pet Clinic application
resource "google_compute_firewall" "sdg" {
  name    = "sdg"
  network = "default"
  allow {
    protocol = "tcp"
    ports    = ["8080"]
  }
  source_ranges = ["0.0.0.0/0"]
  target_tags   = [var.compute_instance]
}
 
# Compute instance with existing static IP
resource "google_compute_instance" "compute_instance" {
  name         = var.compute_instance
  machine_type = var.machine_type
  zone         = var.zone
 
  tags = [var.compute_instance]
 
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }
 
  network_interface {
    network = "default"
    access_config {
      nat_ip = data.google_compute_address.existing_static_ip.address # Reference the existing static IP
    }
  }
}
 
# Output the static IP address
output "static_ip_address" {
  value = data.google_compute_address.existing_static_ip.address
}
