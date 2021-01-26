const io = require('../io/io');


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

module.exports = {__karee_helper, __config, CommandRunner};