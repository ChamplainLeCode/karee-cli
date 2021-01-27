const io = require('../io/io')
const formatter = require('../tools/formatter') 
const KareeGeneratorMeta = require('../models/karee_generator_meta')
const {__karee_helper, KareeProjectConfig} = require('../models/karee_config')

class KareeGenerator{

    settings = new KareeGeneratorMeta()
    projectConfig = new KareeProjectConfig()
    helper = __karee_helper



    async generate(options = {callback: (status = 0) => {}, options: {}}) {

        this.settings.setConfig(options.options)
        if(this.settings.isController){
            this.generateController()
        }else if(this.settings.isScreen){
            this.generateScreen()
        }
        // let spinner = new Spinner()
        // spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
        // spinner.setSpinnerTitle('\x1b[32m\x1b[1mDownloading Flutter files\x1b[22m\x1b[0m')
        // spinner.start()
        // let res = cmd.run(`sleep 10`)
        // res.on('close', (status, signal)=>{
            
        //     if(status == 0){

        //         spinner.stop(false)

        //         /**
        //          * Ici on se déplace dans le projet flutter et on mets à jour la configuration
        //          * dans le pubspec.yaml
        //          */
        //         console.log('\n')
        //         console.log(options)
        //     }else {
        //         options.callback?.call(1);
        //     }
        // });

    }

    generateController(){
        let template = io.readFile(io.projectFile(KareeProjectConfig.__template_controller), false) 
        template = template
            .toString()
            .replace('$appName', this.projectConfig.appName)
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
        io.writeFile(template, `${io.createDir('lib/app/controllers/'+this.settings.path)}/${formatter.cambelToUnderscore(this.settings.className)}_controller.dart`)

        /**
         * Update now the list of controller
         */
        let controllersRegistered = io
            .readFile('lib/app/controllers.dart', false)
            .toString()
            
        controllersRegistered = controllersRegistered
                .substring(0, controllersRegistered.indexOf(']'))
                .trim()

        controllersRegistered = `import "package:${this.projectConfig.appName}/app/controllers/${this.settings.path}/${formatter.cambelToUnderscore(this.settings.className)}_controller.dart";\n`+
        controllersRegistered+
        `\n\t${this.settings.className}Controller(),\n];`
        
        io.writeFile(controllersRegistered, 'lib/app/controllers.dart')

        console.log(`\n\x1b[36m${this.settings.className}Controller\x1b[0m generated in lib/app/controllers/${this.settings.path}/${formatter.cambelToUnderscore(this.settings.className)}_controller.dart\n`)

    }

    generateScreen(){
        let template = ''
        if(this.settings.isStatefull)
            template = io.readFile(io.projectFile(KareeProjectConfig.__template_stf_screen), false) 
        else
            template = io.readFile(io.projectFile(KareeProjectConfig.__template_stl_screen), false)
        template = template
            .toString()
            .replace('$appName', this.projectConfig.appName)
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
            .replace('$name', formatter.underscoreToCambel(this.settings.name))
            .replace('$name', formatter.underscoreToCambel(this.settings.name))
        io.writeFile(template, `${io.createDir('lib/app/screens/'+this.settings.path)}/${formatter.cambelToUnderscore(this.settings.className)}_screen.dart`)


        console.log(`\n\x1b[36m${formatter.underscoreToCambel(this.settings.className)}Screen\x1b[0m generated in lib/app/screens/${this.settings.path}/${formatter.cambelToUnderscore(this.settings.className)}_screen.dart\n`)
    }

}

module.exports = {KareeGenerator}