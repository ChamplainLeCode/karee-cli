const io = require('../io/io')
const formatter = require('../tools/formatter') 
const KareeGeneratorMeta = require('../models/karee_generator_meta')
const {__karee_helper, KareeProjectConfig} = require('../models/karee_config')
const validator = require('../tools/validator')

module.exports = class KareeGenerator{

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
        
        validator.validateGeneratedController(this.settings)
        
        let template = io.readFile(io.projectFile(KareeProjectConfig.__template_controller), false) 
        template = template
            .toString()
            .replace('$appName', this.projectConfig.appName)
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
        
        /**
         * On crée l'arborescence indiquée par l'option --path où générer le controller
         */

        io.createDir('lib/app/controllers/'+(this.settings.path == '/' ? '' : this.settings.path))
        io.writeFile(template, `lib/app/controllers/${(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_controller.dart`)

        /**
         * Update now the list of controller
         */
        let controllersRegistered = io
            .readFile('lib/app/controllers.dart', false)
            .toString()
            
        controllersRegistered = controllersRegistered
                .substring(0, controllersRegistered.indexOf(']'))
                .trim()
        
        if( controllersRegistered.indexOf(formatter.underscoreToCambel(this.settings.className)+'Controller()') >= 0){
            console.log(`\n\x1b[36m${this.settings.className}Controller\x1b[0m generated in lib/app/controllers/${(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_controller.dart\n`)
            return;
        }

        controllersRegistered = `import "package:${this.projectConfig.appName}/app/controllers/${(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_controller.dart";\n`+
        controllersRegistered+
        `\n\t${this.settings.className}Controller(),\n];`
        
        io.writeFile(controllersRegistered, 'lib/app/controllers.dart')

        console.log(`\n\x1b[36m${this.settings.className}Controller\x1b[0m generated in lib/app/controllers/${(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_controller.dart\n`)

    }

    generateScreen(){
        validator.validateGeneratedScreen(this.settings)
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
            .replace('$name', formatter.cambelToUnderscore(this.settings.name))
            .replace('$name', formatter.cambelToUnderscore(this.settings.name))

        if(this.settings.isStatefull)
            template = template
                .replace('$className', formatter.underscoreToCambel(this.settings.className))
                .replace('$className', formatter.underscoreToCambel(this.settings.className))
                .replace('$className', formatter.underscoreToCambel(this.settings.className))
        /**
         * On Crée l'arborescence indiqué par l'option --path où ajouter l'écran
         */
        io.createDir('lib/app/screens/'+(this.settings.path == '/' ? '' : this.settings.path))
        // console.log(`\n#######################################\n## PATH = ${io.createDir('lib/app/screens/'+(this.settings.path == '/' ? '' : this.settings.path))}${formatter.cambelToUnderscore(this.settings.className)}_screen.dart\n##############################`)
        io.writeFile(template, `${'lib/app/screens/'+(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_screen.dart`)

        /**
         * On crée un composant test
         */
        io.createDir('lib/app/screens/'+this.settings.path+'/components')
        io.copy(io.projectFile(KareeProjectConfig.__template_components), 'lib/app/screens/'+(this.settings.path == '/' ? '' : this.settings.path)+'components/congrat_card.dart')

        console.log(`\n\x1b[36m${formatter.underscoreToCambel(this.settings.className)}Screen\x1b[0m generated in lib/app/screens/${(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_screen.dart\n`)
    }

}