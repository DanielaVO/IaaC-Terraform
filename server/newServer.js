var express = require("express");
var myParser = require("body-parser");
var cmd = require('node-cmd');
var fs = require('fs');
var app = express();

var version = 'test1.0';
var caching = 'ReadWrite';
var option = 'FromImage';
var disable = 'false';
var nameResource = 'HiTerra';
var nameResourceNet = 'HiTerraNetwork';
var nameSubnet = 'HiTerraSubnet';
var nameIP = 'HiTerraIps';
var nameInter = 'HiTerraInter';
var nameStorage = 'HiTerraStorage';
var nameResourceContainer = 'HiTerraStorageContainer';
var nameResourceVM = 'HiTerraVM';
var resourceContainer = 'azurerm_storage_container';
var resourceVM = 'azurerm_virtual_machine';

app.use(myParser.urlencoded({extended : true}));
app.post("/firstPath", function(request, response) {
	console.log(request.body); 
	var tenantData = request.body.data.split(",");
	var title = 'script.tf';
  function createScript() {
    return `provider "azurerm" {
      subscription_id = "${tenantData[0]}"
      client_id = "${tenantData[1]}"
      client_secret = "${tenantData[2]}"
      tenant_id = "${tenantData[3]}"
    }
    resource "azurerm_resource_group" "test" {
      name = "${tenantData[4]}"
      location = "${tenantData[5]}"
    }
    resource "azurerm_virtual_network" "test" {
      name = "${tenantData[6]}"
      address_space = ["10.0.0.0/16"]
      location = "$\{azurerm_resource_group.test.location}"
      resource_group_name = "\${azurerm_resource_group.test.name}"
    }
    resource "azurerm_subnet" "test" {
      name = "${tenantData[7]}"
      resource_group_name = "\${azurerm_resource_group.test.name}"
      virtual_network_name = "\${azurerm_virtual_network.test.name}"
      address_prefix = "10.0.2.0/24"
    }
    resource "azurerm_network_interface" "test" {
      name = "${tenantData[8]}"
      location = "\${azurerm_resource_group.test.location}"
      resource_group_name = "\${azurerm_resource_group.test.name}"
      ip_configuration {
        name = "${tenantData[9]}"
        subnet_id = "\${azurerm_subnet.test.id}"
        private_ip_address_allocation = "dynamic"
      }
    }
    resource "azurerm_managed_disk" "test" {
      name = "datadisk_existing"
      location = "\${azurerm_resource_group.test.location}"
      resource_group_name = "\${azurerm_resource_group.test.name}"
      storage_account_type = "Standard_LRS"
      create_option = "Empty"
      disk_size_gb = "1023"
    }
    resource "azurerm_virtual_machine" "test" {
      name = "${tenantData[10]}"
      location = "\${azurerm_resource_group.test.location}"
      resource_group_name = "\${azurerm_resource_group.test.name}"
      network_interface_ids = ["\${azurerm_network_interface.test.id}"]
      vm_size = "Standard_DS1_v2"
      storage_image_reference {
        publisher = "${tenantData[11]}"
        offer     = "${tenantData[12]}"
        sku       = "${tenantData[13]}"
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
        name            = "\${azurerm_managed_disk.test.name}"
        managed_disk_id = "\${azurerm_managed_disk.test.id}"
        create_option   = "Attach"
        lun             = 1
        disk_size_gb    = "\${azurerm_managed_disk.test.disk_size_gb}"
      }
      os_profile {
        computer_name  = "hostname"
        admin_username = "${tenantData[14]}"
        admin_password = "${tenantData[15]}"
      }
      os_profile_linux_config {
        disable_password_authentication = false
      }
      tags {
        environment = "staging"
      }
    }
    `
  }
	
  let datos = createScript();
  console.log(datos);
	fs.writeFile(title, datos, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("Saved!");
	    }
	}); 

  init(apply);

  function init(next){
      cmd.get(
          'terraform init',
        function(err, data, stderr){
           console.log('Init ', data)
           next();
        });
  }

  function apply(){
	  cmd.get(
          'terraform apply -auto-approve',
      function(err, data, stderr){
            console.log('Apply ', data)
            
       });
      }
});

app.listen(8080);
console.log('Corriendo...');