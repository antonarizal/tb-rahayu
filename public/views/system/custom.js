const { ipcRenderer } = require('electron');
const Store = require("electron-store");
const request = require("request");
const config = require('./config');
const package = require('./package');
const store = new Store();
const url = "https://divapos.s3.us-east-1.amazonaws.com/"+package.name+"/custom/";
var url_custom = url + store.get("license_serial") + '.zip';

request
.get(url_custom)
.on('error', function(err) {
    document.getElementById("proses").style.display = "none";
    document.getElementById("id_custom").value = "Tidak ditemukan";

})
.on('response', function(response) {
    console.log(response.statusCode)
    console.log(response.headers['content-type'])
    if(response.statusCode == 200){
        document.getElementById("id_custom").value = "Custom aplikasi ditemukan";
        document.getElementById("proses").style.display = "block";
    }else{
        document.getElementById("proses").style.display = "none";
        document.getElementById("id_custom").value = "Tidak ditemukan";
    }

})
    
let  button = document.getElementById('proses');
button.addEventListener('click', function() {
    ipcRenderer.send('setCustom');
    document.getElementById("loading").style.display = "block";
    document.getElementById("proses").style.display = "none";

})
function urlCustom(){
require('electron').shell.openExternal("https://divapos.exrush.com/kontak");

}