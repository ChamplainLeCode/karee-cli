const io = require('../io/io');
const exception = require('../tools/exception')


class KareeConfig {
    lang = null;

    constructor(json){
        this.lang = json.lang;
    }
}

const __config = new KareeConfig(io.readFile(`${__dirname}/../config/config.json`))


class KareeInstallHelper{
    
    android =  { supports: [] }
    ios =      { supports: [] }
    description = null
    organization = null
    questions = {
        appName: null,
        version: null,
        description: null,
        organization: null,
        androidSupport: null,
        iosSupport: null
    }

    constructor(json){
        this.android.supports = json.android.supports
        this.ios.supports = json.ios.supports
        this.description = json.description,
        this.version = json.version
        this.organization = json.organization
        this.questions.appName = json.questions.appName
        this.questions.version = json.questions.version
        this.questions.description = json.questions.description
        this.questions.organization = json.questions.organization
        this.questions.androidSupport = json.questions.androidSupport
        this.questions.iosSupport = json.questions.iosSupport
    }
}

class KareeProjectConfig{
    
    appName =  { supports: [] }
    settings =      { supports: [] }

    static __file = 'karee_config.json'
    static __template_controller = 'templates/controller.template'
    static __template_stf_screen = 'templates/screen_stf.template'
    static __template_stl_screen = 'templates/screen_stl.template'
    static __template_components = 'templates/component.template'

    
    constructor(){
        this.load()
    }

    load (){
        if(io.exists(KareeProjectConfig.__file)){
            let json = io.readFile(KareeProjectConfig.__file)
            this.appName = json.appName
            this.settings = json.config
        }else{
            exception.notKareeProject();
        }
    }
}

__json_helper = io.readFile(`${__dirname}/../lang/${__config.lang}/messages.json`)

class KareeHelper{

    install = new KareeInstallHelper(__json_helper.install);

}

const __karee_helper = new KareeHelper()

class CommandRunner {
    launch(){
        throw 'Not yet implements'
    }
}

module.exports = {__karee_helper, __config, CommandRunner, KareeProjectConfig};