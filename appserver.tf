resource "google_compute_firewall" "fw_allow_http" {
  name    = "fw-allow-http"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "8080", "443"]
  }
  source_ranges = ["0.0.0.0/0"]
  source_tags   = ["web"]

  target_tags = ["http"]
}

resource "google_compute_firewall" "fw_allow_ssh" {
  name    = "fw-allow-ssh"
  network = "default"
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  target_tags = ["ssh"]
  }


resource "google_compute_instance" "appserver" {
  name         = "appserver-vm-${count.index}"
  machine_type = "f1-micro"
  zone         = var.zone
  count = 2

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-10"
    }
  }

  metadata = {
    ssh-keys = "${var.ssh_username}:${file(var.ssh_pub_key_path)}"
  }

  network_interface {
    network = "default"
    access_config {

    }
  }

  tags = ["ssh", "http"]
}
output "ips_appservers" {
  value = "${join(",", google_compute_instance.appserver.*.network_interface.0.access_config.0.nat_ip)}"
}
