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

    static extractPathInClassName(className = ''){
        let newClassName = className
        let path = '/'
        // trying to extract path from settings.name
        let part = className.split('/')
        if(part.length > 1){
            newClassName = part[part.length-1]
            // We must remove the last part because it represents the class name.
            part = part.slice(0, part.length-1)
            path = part.join('/')+'/'
        }
        return [newClassName, path]
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
            [genConfig.className, genConfig.path] = Validator.extractPathInClassName(genConfig.className)
        }
        
    }

    static validateGeneratedScreen(genConfig = new KareeGeneratorMeta()){

        if(genConfig.className === undefined || genConfig.className === null){
            exception.log('className of screen is required.')
        }
        if(genConfig.path != null && genConfig.path != undefined){
            if(genConfig.path.startsWith('/')){
                genConfig.path = genConfig.path.replace('/', '')
            }
            if( ! genConfig.path.endsWith('/')){
                genConfig.path = genConfig.path + '/'
            }
        }else {
            [genConfig.className, genConfig.path] = Validator.extractPathInClassName(genConfig.className)
        }
    }
}

module.exports = Validator