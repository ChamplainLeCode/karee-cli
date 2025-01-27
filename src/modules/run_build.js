const { Spinner } = require('cli-spinner')
const { KareeProjectConfig} = require('../models/karee_config')
const cmd = require('node-cmd')
const path = require('path')
const { exit } = require('yargs')
const io = require('../io/io')
const KareeGenerator = require('./generator')

class KareeSourceGen{

    projectConfig = new KareeProjectConfig()

    generateSource(callback = () =>{exit(0)}){

        let spinner = new Spinner()
        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
        spinner.setSpinnerTitle(`\x1b[32m\x1b[1mKaree is generating additional source in \x1b[33m${this.projectConfig.appName}\x1b[39m\x1b[22m\x1b[0m`)
        spinner.start()

        let subpath = this.projectConfig.settings.type === 'Module' ? `${path.sep}src${path.sep}` : `${path.sep}`;

        try{
            
            io.delete(`lib${subpath}core${path.sep}extensions`)
            }catch(e){
            }
        try{
            io.delete(`lib${path.sep}resources`)
        }catch(e){
        }
        try{
            io.delete(`lib${subpath}core${path.sep}screens.dart`)
        }catch(e){
        }

        /**
         *  Here we generate language dictionary
         */
        let generator = new KareeGenerator();
        generator.generateResources()

//        spinner = new Spinner()
//        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
        setTimeout(() => {
            spinner.setSpinnerTitle(`\x1b[32m\x1b[1mKaree is running flutter clean in \x1b[33m${this.projectConfig.appName}\x1b[39m\x1b[22m\x1b[0m`)
            spinner.start()
    
            cmd.run(`flutter clean`)
               .on('close', (code, signal) => {
                    spinner.setSpinnerTitle(`\x1b[32m\x1b[1mKaree is running flutter pub get in \x1b[33m${this.projectConfig.appName}\x1b[39m\x1b[22m\x1b[0m`)
                    spinner.start()
                    cmd.run(`flutter pub get && dart run build_runner watch --delete-conflicting-outputs`)
                        .on('close', (code, signal) => {
                            spinner.stop(false)
                            console.log('\n')
                            callback?.call()
                        })
                })
               .on('error', (_) => console.log(_))
               .on('message', (msg) => console.log(msg))
            }, 1000)
    }
}

class KareeBuilder{

    projectConfig = new KareeProjectConfig()
    sourceGen = new KareeSourceGen()

    build(callback = () =>{exit(0)}){

        this.sourceGen.generateSource(
            () => {
                let spinner = new Spinner()
                spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
                spinner.setSpinnerTitle(`\x1b[32m\x1b[1mRunning your project \x1b[33m${this.projectConfig.appName}\x1b[39m\x1b[22m\x1b[0m`)
                spinner.start()

                cmd.run('flutter build')
                    .on('close', (code, signal) => {
                        spinner.stop(false)
                        console.log('\n')
                        callback?.call()
                    })
                    .on('message', (msg) => console.log(msg))
            }
        )
    }


    run(callback = () =>{exit(0)}){

        this.sourceGen.generateSource(
            () => {
                let spinner = new Spinner()
                spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
                spinner.setSpinnerTitle(`\x1b[32m\x1b[1mRunning your project \x1b[33m${this.projectConfig.appName}\x1b[39m\x1b[22m\x1b[0m`)
                spinner.start()

                cmd.run('flutter run')
                    .on('close', (code, signal) => {
                        spinner.stop(false)
                        console.log('\n')
                        callback?.call()
                    })
                    .on('message', (msg) => console.log(msg))
            }
        )
    }
}

module.exports = {
    KareeSourceGen,
    KareeBuilder
}