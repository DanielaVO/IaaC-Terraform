provider "azurerm" {
      subscription_id = "968ef9d7-ac49-41d1-a7f5-68589d7ab8fb"
      client_id = "2ab3be6d-0a98-44c4-a31f-6919dbe39445"
      client_secret = "lfIV6Oou495MYQ3F9NhfywIPSRV8XSBJGVq8hZPHOm8="
      tenant_id = "de386967-cf60-4e09-8e5e-73f8465136ed"
    }
    resource "azurerm_resource_group" "test" {
      name = "test"
      location = "West US 2"
    }
    resource "azurerm_virtual_network" "test" {
      name = "test"
      address_space = ["10.0.0.0/16"]
      location = "${azurerm_resource_group.test.location}"
      resource_group_name = "${azurerm_resource_group.test.name}"
    }
    resource "azurerm_subnet" "test" {
      name = "test"
      resource_group_name = "${azurerm_resource_group.test.name}"
      virtual_network_name = "${azurerm_virtual_network.test.name}"
      address_prefix = "10.0.2.0/24"
    }
    resource "azurerm_network_interface" "test" {
      name = "test"
      location = "${azurerm_resource_group.test.location}"
      resource_group_name = "${azurerm_resource_group.test.name}"
      ip_configuration {
        name = "test"
        subnet_id = "${azurerm_subnet.test.id}"
        private_ip_address_allocation = "dynamic"
      }
    }
    resource "azurerm_managed_disk" "test" {
      name = "datadisk_existing"
      location = "${azurerm_resource_group.test.location}"
      resource_group_name = "${azurerm_resource_group.test.name}"
      storage_account_type = "Standard_LRS"
      create_option = "Empty"
      disk_size_gb = "1023"
    }
    resource "azurerm_virtual_machine" "test" {
      name = "test"
      location = "${azurerm_resource_group.test.location}"
      resource_group_name = "${azurerm_resource_group.test.name}"
      network_interface_ids = ["${azurerm_network_interface.test.id}"]
      vm_size = "Standard_DS1_v2"
      storage_image_reference {
        publisher = "Canonical"
        offer     = "UbuntuServer"
        sku       = "16.04-LTS"
        version   = "latest"
      }
      storage_os_disk {
        name              = "myosdisk1"
        caching           = "ReadWrite"
        create_option     = "FromImage"
        managed_disk_type = "Standard_LRS"
      }
      # Optional data disks
      storage_data_disk {
        name              = "datadisk_new"
        managed_disk_type = "Standard_LRS"
        create_option     = "Empty"
        lun               = 0
        disk_size_gb      = "1023"
      }
      storage_data_disk {
        name            = "${azurerm_managed_disk.test.name}"
        managed_disk_id = "${azurerm_managed_disk.test.id}"
        create_option   = "Attach"
        lun             = 1
        disk_size_gb    = "${azurerm_managed_disk.test.disk_size_gb}"
      }
      os_profile {
        computer_name  = "hostname"
        admin_username = "danie"
        admin_password = "123dani!"
      }
      os_profile_linux_config {
        disable_password_authentication = false
      }
      tags {
        environment = "staging"
      }
    }
    