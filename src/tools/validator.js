const KareeGeneratorMeta = require("../models/karee_generator_meta")
const exception = require("./exception")

class Validator{


    static validateName(val = ''){
        if(val.length > 0 && val.match(/[a-z][a-z_0-9]*/)?.join('') === val)
            return val
        return null
    }
    static validateVersion(val = ''){
        let match = val.match(/^\d+\.\d+\.\d+-{0,1}[a-zA-Z0-9]{0,20}/)?.join('')
        if(val.length > 0 && match === val)
            return val
        return null
    }

    static validateGeneratedController(genConfig = null){
        if(genConfig == null)
            exception.log('Fatal error: Fail to load configs')
        if(genConfig.className === undefined || genConfig.className === null)
            exception.log('className of controller is required')
        if(genConfig.path != null && genConfig.path != undefined){
            if(genConfig.path.startsWith('/'))
                genConfig.path = genConfig.path.replace('/', '')
            if( ! genConfig.path.endsWith('/'))
                genConfig.path = genConfig.path + '/'
        }else {
            genConfig.path  = '/'
        }
        
    }

    static validateGeneratedScreen(genConfig = new KareeGeneratorMeta()){

        if(genConfig.className === undefined || genConfig.className === null)
            exception.log('className of screen is required.')
        // if(genConfig.name === undefined || genConfig.name === null || genConfig.name.length == 0)
        //     exception.log('Screen\'s name is required. add option --name <screenName> ')
        if(genConfig.path != null && genConfig.path != undefined){
            if(genConfig.path.startsWith('/'))
                genConfig.path = genConfig.path.replace('/', '')
            if( ! genConfig.path.endsWith('/'))
                genConfig.path = genConfig.path + '/'
        }else {
            genConfig.path  = '/'
        }
    }
}

module.exports = Validator