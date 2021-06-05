const inquirer = require('inquirer')
const path = require('path')
const io = require('../io/io')
const validator = require('../tools/validator')
const cmd = require('node-cmd')
var Spinner = require('cli-spinner').Spinner;
 
const KareeInstallerMeta = require('../models/karee_installer_meta')
const {__karee_helper, CommandRunner, KareeProjectConfig} = require('../models/karee_config')

class KareeInstaller extends CommandRunner{

    settings = new KareeInstallerMeta
    helper = __karee_helper


    async install(options = {callback: (status = 0) => {}}) {
        do{
            this.settings.appName = validator.validateName(await io.getText(__karee_helper.install.questions.appName, path.basename(process.cwd())))
        }while(this.settings.appName == null)
        do{
            this.settings.organization = await io.getText(__karee_helper.install.questions.organization, `${__karee_helper.install.organization}.${this.settings.appName}`)
        }while(this.settings.organization == null)
        do{
            this.settings.version = validator.validateVersion(await io.getText(__karee_helper.install.questions.version, __karee_helper.install.version))
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

        console.log('\n\n');
        let spinner = new Spinner()
        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
        spinner.setSpinnerTitle('\x1b[32m\x1b[1mDownloading Flutter files\x1b[22m\x1b[0m')
        spinner.start()
        let res = cmd.run(`flutter create --description "${this.settings.description}" --org ${this.settings.organization} --ios-language ${this.settings.iosSupport} --android-language ${this.settings.androidSupport} ${this.settings.appName}`)
        res.on('close', (status, signal)=>{
            
            if(status == 0){

                spinner.stop(false)

                /**
                 * Ici on se déplace dans le projet flutter et on mets à jour la configuration
                 * dans le pubspec.yaml
                 */
                console.log('\n')
                spinner = new Spinner()
                spinner.setSpinnerTitle('\x1b[32m\x1b[1mSetting up Karee configuration\x1b[22m\x1b[0m')
                spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
                spinner.start()
                process.chdir(`${this.settings.appName}`)
                let template = io.readFile(io.projectFile(KareeProjectConfig.__template_pubspec), false)
                template = template
                    .toString()
                    .replace('$appName', this.settings.appName)
                    .replace('$appVersion', this.settings.version)
                    .replace('$appDescription', this.settings.description)
                
                io.writeFile( template, `pubspec.yaml`)

                /**
                 * On définit le fichier de configuration de karee
                 */

                io.writeFile(
                    JSON.stringify({
                        appName: this.settings.appName,
                        config: this.settings
                    }),
                    KareeProjectConfig.__file
                )
                spinner.stop(false)
                console.log('\n')
                
                spinner = new Spinner()
                spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
                spinner.setSpinnerTitle('\x1b[32m\x1b[1mDownloading Karee file\x1b[22m\x1b[0m')
                spinner.start()
                let currentPath = process.cwd();
                cmd.run(`git clone https://github.com/ChamplainLeCode/wp_core_kari.git tmp_karee_conf && cd ${process.cwd()}${path.sep}tmp_karee_conf && git reset --hard v1.0.3 && cd ${currentPath}`)
                    .on("close", (code, signalClone) => {

                        if(code == 0){
                            io.delete(`${process.cwd()}${path.sep}lib`)
                            io.delete(`${process.cwd()}${path.sep}test`)
                            io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}lib`, `${process.cwd()}${path.sep}lib`)
                            io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}test`, `${process.cwd()}${path.sep}test`)
                            io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}resources`, `${process.cwd()}${path.sep}resources`)
                            io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}assets`, `${process.cwd()}${path.sep}assets`)
                            io.delete('tmp_karee_conf')


                            spinner.stop(false)
                            console.log('\n')

                            /**
                             * À cette étape on met à jour les dépendences
                             */

                            this.runPubInGeneral({
                                deep: true,
                                callback: () => {
                                    
                                    io.delete(`build.yaml`)
                                    io.writeFile(
                                        'targets:\n'+
                                        '   $default:\n'+
                                        '       builders:\n'+
                                        '           reflectable:\n'+
                                        '               generate_for:\n'+
                                        '                   - lib/core/core.dart\n'+
                                        '               options:\n'+
                                        '                   formatted: true\n',
                                        'build.yaml'
                                    )
                                    
                                    // this.runGenerateSource(() => {
                                    console.log('\x1b[36m\x1b[1m\n\n\tYour Karee\'s projet is ready\x1b[22m\x1b[0m\n'); 
                                    console.log('\x1b[0m\n\tOpen your project \x1b[33m'+this.settings.appName+'\x1b[39m and happy coding\x1b[22m\x1b[0m\n\n'); 
                                    //     options.callback?.call(0);
                                    // })
                                        
                                }
                            })

                        }else {
                            options.callback?.call(1);
                        }
                    });
            }else {
                options.callback?.call(1);
            }
        });

    }

    runGenerateSource(callback = () =>{}){

        let spinner = new Spinner()
        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
        spinner.setSpinnerTitle(`\x1b[32m\x1b[1mKaree is generating additional files in \x1b[33m${this.settings.appName}\x1b[39m\x1b[22m\x1b[0m`)
        spinner.start()

        io.delete(`lib${path.sep}core${path.sep}extensions`)
        io.delete(`lib${path.sep}core${path.sep}core.reflectable.dart`)
        cmd.run('flutter clean && flutter pub get && flutter packages pub run build_runner build --delete-conflicting-outputs')
           .on('close', (code, signal) => {
               spinner.stop(false)
               console.log('\n')
               callback?.call()
           })
           .on('message', (msg) => console.log(msg))
    }

    runPubInGeneral(options = {deep: false, callback: () => {}}){

        let spinner = new Spinner()
        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
        spinner.setSpinnerTitle('\x1b[32m\x1b[1mRunning "flutter pub get" in \x1b[33m'+this.settings.appName+'\x1b[39m\x1b[22m\x1b[0m')
        spinner.start()

        cmd.run('flutter pub get')
            .on('close', (codePub1, signalPub1)=>{

                if(codePub1 == 0){
                    //if( options.deep ){
                    //    this.runPubInTracker({loader: spinner, callback: options?.callback})  
                    //}else{
                        spinner.stop(false)
                        console.log('\n')
                        options.callback?.call()
                    //}                                  
                }else {

                }
            })
            .on('message', (msg) => console.log(msg))
    }

    runPubInTracker(options = {loader: null, callback: () => {}}){

        process.chdir(`lib${path.sep}core${path.sep}screen_tracker`)
        cmd.run('flutter pub get')
            .on('close', (codePubTracker, signalPubTracker)=>{

                    if(codePubTracker == 0){
                        this.runPubInScreenGen({
                            loader: options.loader,
                            callback: options?.callback
                        })
                    }else{

                    }
            })
    }

    runPubInScreenGen(options = {loader: null, callback: () => {}}){
        process.chdir(`screengen`)
        cmd.run('flutter pub get')
           .on('close', (code, signal) => {
                if(options != null && options.loader != null){
                    options.loader.stop(false)
                    console.log('\n')
                }
                options.callback?.();
           })
    }

}

const kareeInstaller = new KareeInstaller()

module.exports = kareeInstaller
