#!/usr/bin/env node
const inquirer = require('inquirer')
const path = require('path')
const io = require('./io/io')
const validator = require('./tools/validator')
const cmd = require('node-cmd')

const KareeInstallerMeta = require('./models/karee_installer_meta')
const {__karee_helper, __config} = require('./models/karee_config')

class KareeInstaller{

    settings = new KareeInstallerMeta
    helper = __karee_helper

    // constructor(){
    //     this.settings = new KareeInstallerMeta()
    //     this.config = 
    //     this.helper = 
    // }



    async install() {
        do{
            this.settings.appName = validator.validateName(await io.getText(__karee_helper.install.questions.appName, path.basename(__dirname)))
        }while(this.settings.appName == null)
        do{
            this.settings.version = await io.getText(__karee_helper.install.questions.version, __karee_helper.install.version)
        }while(this.settings.version == null)
        do{
            this.settings.description = await io.getText(__karee_helper.install.questions.description, __karee_helper.install.description)
        }while(this.settings.description == null)
        do{
            this.settings.androidSupport = await io.getList(__karee_helper.install.questions.androidSupport, __karee_helper.install.android.supports)
        }while(this.settings.androidSupport == null)
        do{
            this.settings.iosSupport = await io.getList(__karee_helper.install.questions.iosSupport, __karee_helper.install.ios.supports)
        }while(this.settings.iosSupport == null)
        console.log(this.settings)
    }

}

const kareeInstaller = new KareeInstaller()

module.exports = kareeInstaller

console.log(__dirname)
console.log(process.cwd())

console.log(__dirname)
console.log(process.cwd())
kareeInstaller.install()