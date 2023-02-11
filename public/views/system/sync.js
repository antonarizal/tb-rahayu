const { ipcRenderer } = require('electron');
const Store = require("electron-store");
const request = require("request");
const config = require('./config');
const package = require('./package');
const store = new Store({
    configName: 'user-preferences',
    defaults: {
        hostName: '127.0.0.1',
        windowBounds: { width: 1024, height: 700 },
    },
});
const url = "https://divapos.exrush.com/app/"+package.name+"/db/";
var url_custom = url + store.get("license_serial") + '.db';
document.getElementById("loading").style.display = "block";
document.getElementById("uploading").style.display = "none";
document.getElementById("downloading").style.display = "none";

request
.get(url_custom)
.on('error', function(err) {
    document.getElementById("proses").style.display = "none";
    document.getElementById("id_custom").value = "Server tidak ditemukan";
    document.getElementById("loading").style.display = "none";

})
.on('response', function(response) {
    console.log(response.statusCode)
    console.log(response.headers['content-type'])
    if(response.statusCode == 200){
        document.getElementById("id_custom").value = "Server ditemukan";
        document.getElementById("proses").style.display = "block";
        document.getElementById("loading").style.display = "none";

    }else{
        document.getElementById("proses").style.display = "none";
        document.getElementById("id_custom").value = "Server tidak ditemukan";
        document.getElementById("loading").style.display = "none";

    }

})
    
document.getElementById('upload').addEventListener('click', function() {
    ipcRenderer.send('syncUpload');
    document.getElementById("loading").style.display = "block";
    document.getElementById("uploading").style.display = "block";
    document.getElementById("downloading").style.display = "none";
    document.getElementById("proses").style.display = "none";

    })       
 document.getElementById('download').addEventListener('click', function() {
    ipcRenderer.send('syncDownload');
    document.getElementById("loading").style.display = "block";
    document.getElementById("uploading").style.display = "none";
    document.getElementById("downloading").style.display = "block";
    document.getElementById("proses").style.display = "none";

    })
function urlCustom(){
require('electron').shell.openExternal("https://divapos.exrush.com/kontak");

}