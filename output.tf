output "ip" {
  value = "${vultr_instance.instance.main_ip}"
}

output "name" {
  value = "Hello World"
}

output "type" {
  value = "${vultr_instance.instance.plan}"
}

output "status" {
  value = "${vultr_instance.instance.status}"
}

output "ip" {
  value = "${vultr_instance.instance.os}"
}

