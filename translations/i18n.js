const path = require('path')
const electron = require('electron')
const fs = require('fs');
let loadedLanguage;

var userData = require('./locale.json');
let userLocale = !!userData ? userData.locale : 'en';

module.exports = i18n;

function i18n() {
    if (fs.existsSync(path.join(__dirname, userLocale + '.js'))) {
        loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, userLocale + '.js'), 'utf8'))
    } else {
        loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, 'en.js'), 'utf8'))
    }
}

i18n.prototype.__ = function (phrase) {
    let translation = loadedLanguage[phrase]
    if (translation === undefined) {
        translation = phrase
    }
    return translation
}
