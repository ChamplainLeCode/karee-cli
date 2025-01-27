const io = require('../io/io')
const formatter = require('../tools/formatter') 
const KareeGeneratorMeta = require('../models/karee_generator_meta')
const {__karee_helper, KareeProjectConfig} = require('../models/karee_config')
const validator = require('../tools/validator')
const projectConstants = require('../config/constants')
const KareeProjectConstants = require('../config/constants')

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
        const classNameToCambelCase = formatter.underscoreToCambel(this.settings.className)
        let template = io.readFile(io.projectFile(KareeProjectConfig.__template_controller), false) 

        template = template
            .toString()
            .replace('$appName', this.projectConfig.appName)
            .replaceAll('$className', classNameToCambelCase)
        /**
         * We create the whole path passed via --path option.
         */
        const controllerPath = KareeProjectConstants.app_base_dir+(this.settings.path == '/' ? '' : this.settings.path)
        io.createDir(controllerPath)
        io.writeFile(template, `${controllerPath}${formatter.cambelToUnderscore(this.settings.className)}_controller.dart`)

        console.log(`\n\x1b[36m${classNameToCambelCase}Controller\x1b[0m generated in lib/app/controllers/${(this.settings.path == '/' ? '' : this.settings.path)}${formatter.cambelToUnderscore(this.settings.className)}_controller.dart\n`)

    }

    generateScreen(){
        validator.validateGeneratedScreen(this.settings)
        let template = ''
        if(this.settings.isStatefull){
            template = io.readFile(io.projectFile(KareeProjectConfig.__template_stf_screen), false) 
        }else{
            template = io.readFile(io.projectFile(KareeProjectConfig.__template_stl_screen), false)
        }

        const classNameToCambelCase = formatter.underscoreToCambel(this.settings.className)

        template = template
            .toString()
            .replaceAll('$className', classNameToCambelCase)

        if(this.settings.name === null || this.settings.name === undefined){
            template = template 
                .replace('@Screen(\'$ScreenName\')\n', '')
                .replace('import \'package:karee/annotations.dart\';\n', '')
        }else{
            template = template.replace('$ScreenName', formatter.cambelToUnderscore(this.settings.name))
        }

        const screenPath = KareeProjectConstants.app_base_dir+(this.settings.path == '/' ? '' : this.settings.path)
        const classNameToUnderscoreCase = formatter.cambelToUnderscore(this.settings.className)
        /**
         * Here we create the three passed as --path option where the screen should be created.
         */
        io.createDir(screenPath)
        io.writeFile(template, `${screenPath}${classNameToUnderscoreCase}_screen.dart`)

        console.log(`\n\x1b[36m${classNameToCambelCase}Screen\x1b[0m generated in ${screenPath}${classNameToUnderscoreCase}_screen.dart\n`)
    }

}