const Yargs = require('yargs');


class KareeModule{
     
    use(command, params){
        this.start(command, params);
    }
}
class KareeCommandConfig {

    commandModule = {}

    use(command, module){
        this.commandModule[command] = module
    }

    launch(){
        console.log(this.commandModule)
        for( let command in this.commandModule)
            this.commandModule[command].launch()
    }
}

module.exports = {
    module: KareeModule,
    configurer: new KareeCommandConfig()
}