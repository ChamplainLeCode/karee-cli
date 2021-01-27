const { Spinner } = require('cli-spinner')
const { KareeProjectConfig} = require('../models/karee_config')
const cmd = require('node-cmd')
const { exit } = require('yargs')


class KareeSourceGen{

    projectConfig = new KareeProjectConfig()

    generateSource(callback = () =>{exit(0)}){

        let spinner = new Spinner()
        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
        spinner.setSpinnerTitle(`\x1b[32m\x1b[1mKaree is generating additional source in \x1b[33m${this.projectConfig.appName}\x1b[39m\x1b[22m\x1b[0m`)
        spinner.start()

        cmd.run('flutter packages pub run build_runner build --delete-conflicting-outputs')
           .on('close', (code, signal) => {
               spinner.stop(false)
               console.log('\n')
               callback?.call()
           })
           .on('message', (msg) => console.log(msg))
    }
}

module.exports = {
    KareeSourceGen
}