variable "compute_instance" {
    default = "instance"
}
variable "machine_type" {
  default = "n1-standard-1"
}
variable "zone" {
    default = "us-central1-a"
}
variable "git_repository_url" {
description = "URL of the Git repository to clone"
type        = string
}
variable "git_name" {
description = "Name of the Git repository"
type        = string
default     = "sdg" 
}
