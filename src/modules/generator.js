const io = require('../io/io')
const formatter = require('../tools/formatter') 
const KareeGeneratorMeta = require('../models/karee_generator_meta')
const {__karee_helper, KareeProjectConfig} = require('../models/karee_config')
const validator = require('../tools/validator')
const projectConstants = require('../config/constants')
module.exports = class KareeGenerator{

    settings = new KareeGeneratorMeta()

    /**
        Here we load project configuration,
        It'll automaticaly exit the execution if the karee command that requires this is
        not running into karee project.
    */
    projectConfig = new KareeProjectConfig()
    helper = __karee_helper



    async generate(options = {callback: (status = 0) => {}, options: {}}) {

        this.settings.setConfig(options.options)
        if(this.settings.isController){
            this.generateController()
        }else if(this.settings.isScreen){
            this.generateScreen()
        }
        // console.log(this.settings)
    }

    /**
     * This function is used to generate dictionary class from i18n
     */
    generateResources(){
        let dictionary = io.readFile(projectConstants.dictionary_application_file)
        io.createDir(projectConstants.resources_dir_generated)
        let f = 
        '\nclass Dictionary {\n\n';

        for(let t in dictionary){
            f += `\tstatic const String ${formatter.pointedToCambel(t)} = '${t}';\n`;
        }
        f += '}';
        io.writeFile(f, projectConstants.resources_dir_generated_i18n);
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
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
            .replace('$className', formatter.underscoreToCambel(this.settings.className))
        
        /**
         * On crée l'arborescence indiquée par l'option --path où générer le controller
         */

        io.createDir('lib/app/controllers/'+(this.settings.path == '/' ? '' : this.settings.path))
        io.writeFile(template, `lib/app/controllers/${(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_controller.dart`)

        console.log(`\n\x1b[36m${this.settings.className}Controller\x1b[0m generated in lib/app/controllers/${(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_controller.dart\n`)

    }

    generateScreen(){
        // console.log(this.settings)
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
        if(this.settings.name === null || this.settings.name === undefined){
            template = template 
                .replace('@Screen("$name")', formatter.cambelToUnderscore(''))
                .replace('import \'package:karee/annotations.dart\';\n', '')
                .replace('$name', formatter.cambelToUnderscore(''))
            // console.log(template)
        }else{
            template = template
                .replace('$name', formatter.cambelToUnderscore(this.settings.name))
                .replace('$name', formatter.cambelToUnderscore(this.settings.name))
        }

        if(this.settings.isStatefull)
            template = template
                .replace('$className', formatter.underscoreToCambel(this.settings.className))
                .replace('$className', formatter.underscoreToCambel(this.settings.className))
                .replace('$className', formatter.underscoreToCambel(this.settings.className))
        /**
         * On Crée l'arborescence indiqué par l'option --path où ajouter l'écran
         */
        io.createDir('lib/app/screens/'+(this.settings.path == '/' ? '' : this.settings.path))
        io.writeFile(template, `${'lib/app/screens/'+(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_screen.dart`)

        /**
         * On crée un composant test
         */
        io.createDir('lib/app/screens/'+this.settings.path+'/components')
        io.copy(io.projectFile(KareeProjectConfig.__template_components), 'lib/app/screens/'+(this.settings.path == '/' ? '' : this.settings.path)+'components/congrat_card.dart')

        console.log(`\n\x1b[36m${formatter.underscoreToCambel(this.settings.className)}Screen\x1b[0m generated in lib/app/screens/${(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_screen.dart\n`)
    }

}