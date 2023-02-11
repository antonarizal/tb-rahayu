'use strict';
const UglifyPHP = require('uglify-php');
var config = require('../config');
const dirSource = __dirname + "/project/"+config.dirname


  // console.log(arr[i]);
function ugly(fileSource,fileTarget){
  var target = __dirname.replace('build', 'project');
  var config = require('../config');
  var dirTarget = target+'\\'+config.dirname

  var options = {
    "excludes": [
      '$GLOBALS',
      '$_SERVER',
      '$_GET',
      '$_POST',
      '$_FILES',
      '$_REQUEST',
      '$_SESSION',
      '$_ENV',
      '$_COOKIE',
      '$php_errormsg',
      '$HTTP_RAW_POST_DATA',
      '$http_response_header',
      '$argc',
      '$argv',
      '$this'
    ],
    "minify": {
      "replace_variables": false,
      "remove_whitespace": true,
      "remove_comments": true,
      "minify_html": true
    },
    "output": fileTarget // If it's empty the promise will return the minified source code
  }
  
    UglifyPHP.minify(fileSource, options).then(function (source) {

  });

  // return dirTarget +"\\"+filePath;
  
}


const path = require('path')
const fs = require('fs')


var target = __dirname.replace('build', 'project');
var config = require('../config');
var dirTarget = target+'\\'+config.dirname


const walkSync = require('walk-sync');
const paths = walkSync(dirSource,  { directories: false, includeBasePath: true })
const waitFor = (ms) => new Promise(r => setTimeout(r, ms))
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const start = async () => {
  await asyncForEach(paths, async (fileSource) => {
    await waitFor(50)
    if (fileSource.endsWith('.php')) {
      var fileTarget = fileSource.replace('build/', '');
      ugly(fileSource,fileTarget)
      console.log("Minify : ",fileSource)
    }

  })
  console.log('Done')
}

start()
