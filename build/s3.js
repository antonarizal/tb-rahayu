const AWS = require('aws-sdk');
const fs = require('fs')
var config = require('../config');
var package = require('../package');
const version = process.env.npm_package_version;
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('Uloading.. %s');
spinner.setSpinnerString('|/-\\');
var AdmZip = require('adm-zip');
var releaseDir = __dirname.replace('build', 'release');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })
  console.log("Compressing to zip..")
  var zip = new AdmZip();
  zip.addLocalFile(releaseDir + "/"+config.appName+".setup."+package.version+".exe");
  var willSendthis = zip.toBuffer();
  zip.writeZip(releaseDir + "/"+config.appName+".setup.zip");
  console.log("Compress done.")

const source = releaseDir + "/"+config.appName+".setup.zip"
const filename = config.appName +'/'+config.appName+".setup.zip"
const fileContent = fs.readFileSync(source)
const params = {
  Bucket: 'divapos',
  Key: `${filename}`,
  Body: fileContent
}

console.log("Upload to AWS S3..")
spinner.start();

s3.upload(params, (err, data) => {
  if (err) {
    console.log(err)
  }
  console.log(data);
  console.log("Done.")
  spinner.stop();
})
