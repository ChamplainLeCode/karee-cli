#!/usr/bin/env node
const inquirer = require('inquirer')
const path = require('path')
const io = require('./io/io')


class KareeInstaller{


    async setAppName(){
        let appName = await io.getText('What is the program name', path.basename(__dirname))
        this.appName
    }
    async install() {
        let appName = await io.getText('What is the program name', __dirname.substring(__dirname.lastIndexOf('/')+1))
        console.log(appName)
    }

}

const kareeInstaller = new KareeInstaller();

module.exports = kareeInstaller;

kareeInstaller.install();