#!/usr/bin/env node

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');
const rimraf = require('rimraf');

deleteOutputFolder()
.then(getInstallerConfig)
.then(createWindowsInstaller)
.catch((error) => {
    console.error(error.message || error);
    process.exit(1);
})
.then(() => console.log("The installers has been succesfully created!"));

function getInstallerConfig () {
    const rootPath = path.join(__dirname, '..');
    const outPath = path.join(rootPath, 'out');

    return Promise.resolve({
        appDirectory: path.join(outPath, 'POS-Print-win32-ia32'),
        exe: 'POS-Print.exe',
        authors: 'Tecdiary IT Solutions',
        iconUrl: path.join(rootPath, 'assets/icons/win/icon.ico'),
        loadingGif: path.join(rootPath, 'assets/img/loading.gif'),
        noMsi: true,
        outputDirectory: path.join(outPath, 'windows-installer'),
        setupExe: 'POS-Print-Installer.exe',
        setupIcon: path.join(rootPath, 'assets/icons/win/icon.ico'),
        skipUpdateIcon: true
    });
}

function deleteOutputFolder () {
    return new Promise((resolve, reject) => {
        rimraf(path.join(__dirname, '..', 'out', 'windows-installer'), (error) => {
            error ? reject(error) : resolve();
        });
    });
}
