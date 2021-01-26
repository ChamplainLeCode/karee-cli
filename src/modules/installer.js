const inquirer = require('inquirer')
const path = require('path')
const io = require('../io/io')
const validator = require('../tools/validator')
const cmd = require('node-cmd')
var Spinner = require('cli-spinner').Spinner;
 
const KareeInstallerMeta = require('../models/karee_installer_meta')
const {__karee_helper, CommandRunner} = require('../models/karee_config')

class KareeInstaller extends CommandRunner{

    settings = new KareeInstallerMeta
    helper = __karee_helper

    // constructor(){
    //     this.settings = new KareeInstallerMeta()
    //     this.config = 
    //     this.helper = 
    // }

    // async launch(){
    //     await this.install({
    //         callback: (status) => process.exit(status)
    //     })
    // }


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
                io.writeFile(
                `name: ${this.settings.appName}\n`+
                `description: ${this.settings.description}.\n`+
                `# The following line prevents the package from being accidentally published to\n`+
                `# pub.dev using \`pub publish\`. This is preferred for private packages.\n`+
                `publish_to: 'none' # Remove this line if you wish to publish to pub.dev\n`+
                `# The following defines the version and build number for your application.\n`+
                `# A version number is three numbers separated by dots, like 1.2.43\n`+
                `# followed by an optional build number separated by a +.\n`+
                `# Both the version and the builder number may be overridden in flutter\n`+
                `# build by specifying --build-name and --build-number, respectively.\n`+
                `# In Android, build-name is used as versionName while build-number used as versionCode.\n`+
                `# Read more about Android versioning at https://developer.android.com/studio/publish/versioning\n`+
                `# In iOS, build-name is used as CFBundleShortVersionString while build-number used as CFBundleVersion.\n`+
                `# Read more about iOS versioning at\n`+
                `# https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html\n`+
                `version: ${this.settings.version}\n\n`+
                `environment:\n`+
                `   sdk: ">=2.3.0 <3.0.0"\n\n`+
                `dependencies:\n`+
                `   flutter:\n`+
                `       sdk: flutter\n\n`+
                `# The following adds the Cupertino Icons font to your application.\n`+
                `# Use with the CupertinoIcons class for iOS style icons.\n`+
                `   cupertino_icons: any\n\n\n`+
                `dev_dependencies:\n`+
                `   flutter_test:\n`+
                `       sdk: flutter\n`+
                `    \n`+
                `#\n`+
                `# Karee additional dependencies\n`+
                `# \n`+
                `   reflectable: 2.2.0\n`+
                `   build_runner: any\n`+
                `   build: '>=0.12.0 <2.0.0'\n`+
                `   source_gen: ^0.9.0\n`+
                `   screen_tracker:\n`+
                `       path: lib/core/screen_tracker/\n`+
                `   screengen:\n`+
                `       path: lib/core/screen_tracker/screengen/\n`+
                `    \n`+
                `# For information on the generic Dart part of this file, see the\n`+
                `# following page: https://dart.dev/tools/pub/pubspec\n\n`+
                `# The following section is specific to Flutter.\n`+
                `flutter:\n\n`+
                `# The following line ensures that the Material Icons font is\n`+
                `# included with your application, so that you can use the icons in\n`+
                `# the material Icons class.\n`+
                `   uses-material-design: true\n`+
                `# To add assets to your application, add an assets section, like this:\n`+
                `# assets:\n`+
                `#   - images/a_dot_burr.jpeg\n`+
                `#   - images/a_dot_ham.jpeg\n\n`+
                `# An image asset can refer to one or more resolution-specific "variants", see\n`+
                `# https://flutter.dev/assets-and-images/#resolution-aware.\n\n`+
              
                `# For details regarding adding assets from package dependencies, see\n`+
                `# https://flutter.dev/assets-and-images/#from-packages\n\n`+
              
                `# To add custom fonts to your application, add a fonts section here,\n`+
                `# in this "flutter" section. Each entry in this list should have a\n`+
                `# "family" key with the font family name, and a "fonts" key with a\n`+
                `# list giving the asset and other descriptors for the font. For\n`+
                `# example:\n`+
                `# fonts:\n`+
                `#   - family: Schyler\n`+
                `#     fonts:\n`+
                `#       - asset: fonts/Schyler-Regular.ttf\n`+
                `#       - asset: fonts/Schyler-Italic.ttf\n`+
                `#         style: italic\n`+
                `#   - family: Trajan Pro\n`+
                `#     fonts:\n`+
                `#       - asset: fonts/TrajanPro.ttf\n`+
                `#       - asset: fonts/TrajanPro_Bold.ttf\n`+
                `#         weight: 700\n`+
                `#\n`+
                `# For details regarding fonts from package dependencies\n`+
                `# see https://flutter.dev/custom-fonts/#from-packages\n`+
                `#`
                , `pubspec.yaml`)
                spinner.stop(false)
                console.log('\n')
                
                spinner = new Spinner()
                spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
                spinner.setSpinnerTitle('\x1b[32m\x1b[1mDownloading Karee file\x1b[22m\x1b[0m')
                spinner.start()
                cmd.run('git clone https://github.com/ChamplainLeCode/wp_core_kari.git tmp_karee_conf')
                    .on("close", (code, signalClone) => {

                        if(code == 0){
                            io.delete(`${process.cwd()}${path.sep}lib`)
                            io.delete(`${process.cwd()}${path.sep}test`)
                            io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}lib`, `${process.cwd()}${path.sep}lib`)
                            io.move(`${process.cwd()}${path.sep}tmp_karee_conf${path.sep}test`, `${process.cwd()}${path.sep}test`)
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
                                        '           screengen|screen_tracker:\n'+
                                        '               enabled: true\n'+
                                        'builders:\n'+
                                        '   screen_tracker:\n'+
                                        '       target: ":screengen"\n'+
                                        `       import: "package:${this.settings.appName}/core/screen_tracker/screengen/lib/builder.dart"\n`+
                                        '       builder_factories: ["screenTracker"]\n'+
                                        '       build_extensions: {".dart": [".kari"]}\n'+
                                        '       auto_apply: dependents\n'+
                                        '       build_to: cache\n'+
                                        '       applies_builders: ["source_gen|combining_builder"]\n', 'build.yaml'
                                    )

                                    /**
                                     * On revient à la racine du projet créé
                                     * pour générer la configuration de build 
                                     */
                                    process.chdir(`..${path.sep}..${path.sep}..${path.sep}..`)
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
                                    
                                    this.runGenerateSource(() => {
                                        console.log('\x1b[36m\x1b[1m\n\n\tYour Karee\'s projet is ready\x1b[22m\x1b[0m\n'); 
                                        console.log('\x1b[36m\x1b[1m\n\trun "cd  \x1b[33m'+this.settings.appName+'\x1b[39m && flutter run"\x1b[22m\x1b[0m\n\n'); 
                                        options.callback?.call(0);
                                    })
                                        
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

        cmd.run('flutter packages pub run build_runner build --delete-conflicting-outputs')
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
                    if( options.deep ){
                        this.runPubInTracker({loader: spinner, callback: options?.callback})  
                    }else{
                        spinner.stop(false)
                        console.log('\n')
                        options.callback?.call()
                    }                                  
                }else {

                }
            })
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
