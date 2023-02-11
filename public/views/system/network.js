// 'use strict';
const { app, dialog, BrowserWindow, Menu } = require('electron');
const network = require('network');
const Store = require("electron-store");
const store = new Store();
const host = store.get('hostName');
if(host !== '0.0.0.0'){
    document.getElementById("host").style.display = "block"
}else{
    document.getElementById("host").style.display = "none"

}
network.get_active_interface(function(err, obj) {
 
    if(obj === undefined){
        document.getElementById("ip_address").value = "Tidak ditemukan"

    }else{
        document.getElementById("ip_address").value = "http://"+obj.ip_address+":8899"
        var text ="Informasi Jaringan\n";
        var text =text + 'Network Name    : ' + obj.name + "\n";
        var text =text + 'IP Address      : ' + obj.ip_address + "\n";
        var text =text + 'MAC Address     : ' + obj.mac_address + "\n";
        document.getElementById("network").value = text;
    }

  })



