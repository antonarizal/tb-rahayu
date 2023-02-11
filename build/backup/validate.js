// 'use strict';
const { app, dialog, BrowserWindow, Menu } = require('electron');
const crypto = require('crypto');
// const {machineId, machineIdSync} = require('node-machine-id');
const fs = require('fs');
const config = require('./config');
const zeroRegex = /(?:[0]{2}[:\-]){5}[0]{2}/;
const axios = require('axios');
const OS = require('os');
const { pid } = require('process');
let activate = document.querySelector('#activate');
let loading = document.querySelector('#loading');
// activate.style.display = 'none';
// loading.style.display = 'block';
// const mId = machineIdSync();
const homedir = OS.homedir();
const hostname = OS.hostname();
// const oId = machineIdSync({ original: true });
const pId = (function() {
    const ps = OS.cpus();
    let model = ps.reduce(function(m, v) {
        return m + (m == '' ? '' : '::') + v.model + ':' + v.speed;
    }, '');
    model = crypto
        .createHmac('sha256', model)
        .update(model)
        .digest('hex');
    return model;
})();
const macaddress = require('macaddress');

const Store = require("electron-store");
const store = new Store({
    configName: 'user-preferences',
    defaults: {
        hostName: '127.0.0.1',
        windowBounds: { width: 1024, height: 700 },
    },
});

function validLicense(license){
    return license.substr(0, 17)
}
function validMachine(machineId){
    return machineId.substr(0, 8)
}
const nId = (function() {
    const ifaces = OS.networkInterfaces();
    var addresses = [];
    for (var dev in ifaces) {
        var iface = ifaces[dev].filter(function(details) {
            if (!zeroRegex.test(details.mac)) {
                addresses.push(details.mac);
            }
        });
    }
    const uniAddresses = Array.from(new Set(addresses)).join();
    return uniAddresses;
})();

var licenseKey = require('nodejs-license-key');
// var UniqMachineId = config.code + validMachine(machineIdSync().toUpperCase());


var whatsapp = config.whatsapp
const Generator = require("license-key-generator");

const options = {
    type: "random", // default "random"
    length: 8, // default 16
    group: 8, // default 4
    split: "-", // default "-"
    splitStatus: true // default true
}
const serial = new Generator(options);
serial.get((error,serial)=>{
    macaddress.one(function(err,mac){
        let UniqMachineId = config.code + mac.replaceAll(':', '').substr(0, 8).toUpperCase();
        document.getElementById("kode").value = UniqMachineId

        let userInfo = {
            code: UniqMachineId,
            serial: serial,
          };
          let userLicense = {
            info: userInfo,
            prodCode: 'LEN100120',
            osType: 'WIN'
          };
          
          var license_key = licenseKey.createLicense(userLicense);

    });

// document.getElementById("kode").value = xMID

    // document.getElementById("serial").value = serial
    // document.getElementById("license_key").value = license_key.license.substr(0, 17)
    console.log(serial)
    console.log(validLicense(license_key.license))
})

    document.getElementById('whatsapp').innerHTML  = whatsapp
    let button = document.getElementById('update');
    if (button) {
        button.addEventListener('click', function() {
        //let license = validLicense(licenseKey.createLicense(userLicense))

        macaddress.one(function(err,mac){
            let getSerial = document.getElementById("serial").value.trim();
            let getLicense = document.getElementById("license_key").value.trim();

            let UniqMachineId = config.code + mac.replaceAll(':', '').substr(0, 8).toUpperCase();
            let userInfo = {
                code: UniqMachineId,
                serial: getSerial,
              };
              let userLicense = {
                info: userInfo,
                prodCode: 'LEN100120',
                osType: 'WIN'
              };
              let license_key = licenseKey.createLicense(userLicense);

            document.getElementById("status").text="Berhasil"
            console.log("LISENSI")
            console.log(getSerial)
            console.log("Valid : " +validLicense(license_key.license))
            console.log("GET : " + getLicense)
            if(validLicense(license_key.license) == getLicense)
            {
                document.getElementById("status").innerHTML = "Aktivasi Berhasil!";
                document.getElementById("status").style.background = "green";
                document.getElementById("status").style.display = "block";
                store.set("license_serial",getSerial);
                store.set("license_key",getLicense);
                store.set("license_status","active");
                document.getElementById("restart").style.display = "block";
                // app.relaunch(); 
                // app.exit(0);
            }else{
                document.getElementById("status").innerHTML = "Aktivasi Gagal!";
                document.getElementById("status").style.background = "red";
                document.getElementById("status").style.display = "block";
                // app.relaunch(); 
                // app.exit(0);
            }
        });
    })
}

