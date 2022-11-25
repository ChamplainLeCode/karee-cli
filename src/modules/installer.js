const path = require('path')
const io = require('../io/io')
const validator = require('../tools/validator')
const cmd = require('node-cmd')
var Spinner = require('cli-spinner').Spinner;
const formatter = require('../tools/formatter')
const KareeProjectConstants = require('../config/constants')

const KareeInstallerMeta = require('../models/karee_installer_meta')
const {__karee_helper, CommandRunner, KareeProjectConfig} = require('../models/karee_config');
const { assert } = require('console');

class KareeInstaller extends CommandRunner {

    settings = new KareeInstallerMeta
    helper = __karee_helper
    
    /**
     * When creating a project, this var keeps null value, 
     * but when it's a module, it is initialized with the current application settings.
     */
    config = null
    isModule = false
    pathSeparator = ''


    async install(options = {callback: (status = 0) => {}}) {
        do{
            this.settings.type = await io.getList(__karee_helper.install.questions.type, __karee_helper.install.type )
            console.log(this.settings.type)
        }while(this.settings.type == null)
        
        if(this.settings.type == __karee_helper.install.type[1]){
            this.config = new KareeProjectConfig()
            this.pathSeparator = 'modules'+path.sep
            this.isModule = true
        }
        do{
            this.settings.appName = validator.validateName(await io.getText(__karee_helper.install.questions.appName.replace('{type}', this.settings.type.toLowerCase()), path.basename(process.cwd())))
        }while(this.settings.appName == null)
        do{
            this.settings.organization = await io.getText(__karee_helper.install.questions.organization, `${this.config?.settings.organization ?? __karee_helper.install.organization}.${this.settings.appName}`)
        }while(this.settings.organization == null)
        do{
            this.settings.version = validator.validateVersion(await io.getText(__karee_helper.install.questions.version.replace('{type}', this.settings.type.toLowerCase()), __karee_helper.install.version))
        }while(this.settings.version == null)
        do{
            this.settings.description = await io.getText(__karee_helper.install.questions.description.replace('{type}', this.settings.type.toLowerCase()), __karee_helper.install.description.replace('{type}', this.settings.type.toLowerCase()))
        }while(this.settings.description == null)
        if(!this.config){
            do{
                this.settings.androidSupport = await io.getList(__karee_helper.install.questions.androidSupport, __karee_helper.install.android.supports)
            }while(this.settings.androidSupport == null)
            do{
                this.settings.iosSupport = await io.getList(__karee_helper.install.questions.iosSupport, __karee_helper.install.ios.supports)
            }while(this.settings.iosSupport == null)
        }
        console.log('\n\n');

        /**
         * In case of module creation this path contains the path of the root application
         */
        let rootAppDir = process.cwd();

        let spinner = new Spinner()
        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
        spinner.setSpinnerTitle('\x1b[32m\x1b[1mDownloading Flutter files\x1b[22m\x1b[0m')
        spinner.start()
        let res = cmd.run(
            `flutter `+
                `create ${this.isModule ? ' -t module ' : ''} `+
                    `--description "${this.settings.description}" `+
                    `--org ${this.settings.organization} `+
                    `--ios-language ${this.settings.iosSupport} `+
                    `--android-language ${this.settings.androidSupport} ${this.pathSeparator}${this.settings.appName} `+
            ((this.isModule) 
            ? (` && flutter pub add --path ${this.pathSeparator}${this.settings.appName} ${this.settings.appName}`)
            : ('')))
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
                process.chdir(`${this.pathSeparator}${this.settings.appName}`)
                let template = (this.isModule)
                     ? io.readFile(io.projectFile(KareeProjectConfig.__template_pubspec_module), false)
                     : io.readFile(io.projectFile(KareeProjectConfig.__template_pubspec), false)
                template = template
                    .toString()
                    .replace('$appName', this.settings.appName)
                    .replace('$appVersion', this.settings.version)
                    .replace('$appDescription', this.settings.description)
                    .replace('$appOrganization', this.settings.organization)
                    .replace('$appOrganization', this.settings.organization)

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

                if(!this.isModule){
                    cmd.run(`git clone https://github.com/ChamplainLeCode/wp_core_kari.git tmp_karee_conf && cd ${process.cwd()}${path.sep}tmp_karee_conf && git reset --hard ${KareeProjectConstants.supportedWpKareeCoreVersion} && cd ${currentPath}`)
                    .on('data', (_) => console.log(_))    
                    .on("error", (_) => console.log(_))
                    .on("close", (code, signalClone) => {

                            if(code == 0){
                                io.delete(`${process.cwd()}${path.sep}lib`)
                                io.delete(`${process.cwd()}${path.sep}test`)
                                io.delete(`${process.cwd()}${path.sep}resources`)
                                io.delete(`${process.cwd()}${path.sep}modules`)
                                io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}lib`, `${process.cwd()}${path.sep}lib`)
                                io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}test`, `${process.cwd()}${path.sep}test`)
                                io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}resources`, `${process.cwd()}${path.sep}resources`)
                                io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}assets`, `${process.cwd()}${path.sep}assets`)
                                io.delete('tmp_karee_conf')
                                io.delete(`lib${path.sep}core${path.sep}core.reflectable.dart`)


                                spinner.stop(false)
                                console.log('\n')

                                /**
                                 * À cette étape on met à jour les dépendences
                                 */

                                this.runPubInGeneral({
                                    deep: false,
                                    callback: () => {
                                        
                                        

                                        // We setup the default lints for current project
                                        template =  io.readFile(io.projectFile(KareeProjectConfig.__template_analysis_options_config), false)
                                        io.delete(KareeProjectConstants.analysis_options_filename)
                                        io.writeFile( template, KareeProjectConstants.analysis_options_filename)
                                        
                                        
                                        console.log('\x1b[36m\x1b[1m\n\n\tYour Karee\'s projet is ready\x1b[22m\x1b[0m\n'); 
                                        console.log('\x1b[0m\n\tOpen your project \x1b[33m'+this.settings.appName+'\x1b[39m and happy coding\x1b[22m\x1b[0m\n\n'); 
                                            
                                    }
                                })

                            }else {
                                options.callback?.call(1);
                            }
                        });
                }else{
                        cmd.run(`git clone https://github.com/ChamplainLeCode/wp_module_core_karee.git tmp_karee_conf && cd ${process.cwd()}${path.sep}tmp_karee_conf && git reset --hard ${KareeProjectConstants.supportedModuleVersion} && cd ${currentPath}`)
                        .on("close", (code, signalClone) => {

                            if(code == 0){
                                io.delete(`${process.cwd()}${path.sep}lib`)
                                io.delete(`${process.cwd()}${path.sep}test`)
                                io.delete(`${process.cwd()}${path.sep}resources`)
                                io.delete(`${process.cwd()}${path.sep}assets`)
                                io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}lib`, `${process.cwd()}${path.sep}lib`)
                                io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}test`, `${process.cwd()}${path.sep}test`)
                                io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}resources`, `${process.cwd()}${path.sep}resources`)
                                io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}assets`, `${process.cwd()}${path.sep}assets`)
                                io.delete('tmp_karee_conf')

                                let template =  io.readFile(io.projectFile(KareeProjectConfig.__template_module_declaration), false)
                                template = template
                                    .toString()
                                    .replace('$moduleName', this.settings.appName)
                                    .replace('$moduleName', this.settings.appName)
                                    .replace('$moduleName', this.settings.appName)
                                    .replace('$moduleClass', formatter.underscoreToCambel(this.settings.appName))
                                
                                io.writeFile( template, `lib${path.sep}${this.settings.appName}_module.dart`)

                                template =  io.readFile(io.projectFile(KareeProjectConfig.__template_module_main_declaration), false)
                                template = template
                                    .toString()
                                    .replace('$moduleName', this.settings.appName)
                                    .replace('$moduleClass', formatter.underscoreToCambel(this.settings.appName))

                                io.writeFile( template, `lib${path.sep}main.dart`)

                                template =  io.readFile(io.projectFile(KareeProjectConfig.__template_module_route_declaration), false)
                                template = template
                                    .toString()
                                    .replace('$moduleName', this.settings.appName)
                                
                                io.writeFile( template, `lib${path.sep}app${path.sep}routes${path.sep}routes.dart`)



                                // We setup the default lints for current project
                                template =  io.readFile(io.projectFile(KareeProjectConfig.__template_analysis_options_config), false)
                                io.delete(KareeProjectConstants.analysis_options_filename)
                                io.writeFile( template, KareeProjectConstants.analysis_options_filename)
                                
                                spinner.stop(false)
                                console.log('\n')

                                /**
                                 * Here we update dependencies
                                 */

                                this.runPubInGeneral({
                                    deep: true,
                                    path: currentPath,
                                    callback: () => {
                                        
                                        // After project generation, we need to subcribe our new module in the root application.
                                        process.chdir(rootAppDir)

                                        let template =  io.readFile(`lib${path.sep}core${path.sep}app.module.dart`, false)
                                        template = (
                                            `import 'package:${this.settings.appName}/${this.settings.appName}_module.dart';\n`+
                                            template
                                            .toString()
                                            
                                            )
                                            .replace(
                                                `  //-------------------------------------------------------//\n`+
                                                `  //--------------- END MODULE REGISTRATION    ------------//\n`+
                                                `  //-------------------------------------------------------//\n`,
                                        
                                        
                                                `  //--------------- MODULE ${this.settings.appName.toUpperCase()} DECLARATION ------------//\n`+
                                                `  KareeModuleLoader.load(${formatter.underscoreToCambel(this.settings.appName)}Module());\n`+
                                                `  //--------------- MODULE END DECLARATION     ------------//\n\n`+
                                                `  //-------------------------------------------------------//\n`+
                                                `  //--------------- END MODULE REGISTRATION    ------------//\n`+
                                                `  //-------------------------------------------------------//\n`
                                            )
                                        
                                        io.writeFile( template, `lib${path.sep}core${path.sep}app.module.dart`)


                                        // We setup the default lints for current project
                                        template =  io.readFile(io.projectFile(KareeProjectConfig.__template_analysis_options_config), false)
                                        io.delete(KareeProjectConstants.analysis_options_filename)
                                        io.writeFile( template, KareeProjectConstants.analysis_options_filename)
                                        

                                        console.log('\x1b[36m\x1b[1m\n\n\tYour Karee\'s module is ready\x1b[22m\x1b[0m\n'); 
                                        console.log('\x1b[0m\n\tOpen your project \x1b[33m'+this.settings.appName+'\x1b[39m and happy coding\x1b[22m\x1b[0m\n\n');
                                    }
                                })

                            }else {
                                options.callback?.call(1);
                            }
                        });
                    }
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

    runPubInGeneral(options = {deep: false, path: null, callback: () => {}}){
        assert(!(options.deep ^ options.path != null))
        let spinner = new Spinner()
        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
        spinner.setSpinnerTitle('\x1b[32m\x1b[1mRunning "flutter pub get" in \x1b[33m'+this.settings.appName+'\x1b[39m\x1b[22m\x1b[0m')
        spinner.start()

        cmd.run('flutter pub get')
            .on('close', (codePub1, signalPub1)=>{

                if(codePub1 == 0){
                    if( options.deep ){
                       this.runPubInPath({loader: spinner, path: path, callback: options?.callback})
                    }else{
                        spinner.stop(false)
                        console.log('\n')
                        options.callback?.call()
                    }
                }else {

                }
            })
            .on('message', (msg) => console.log(msg))
    }

    runPubInPath(options = {loader: null, path: null, callback: () => {}}){
        cmd.run(`cd ${options.path} &&  flutter pub get`)
            .on('close', (codePubTracker, signalPubTracker)=>{

                options.loader.stop(false)
                console.log('\n')
                options.callback?.call()
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
