output "ip" {
  value = "${hetzner_instance.server.public_net.ipv4.ip}"
}

output "name" {
  value = "Hello World"
}

output "type" {
  value = "${hetzner_instance.server.server_type.description}"
}

output "status" {
  value = "${hetzner_instance.server.created}"

