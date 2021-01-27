const Yargs   = require('yargs');


class KareeModule{
     
    use(command, params){
        this.start(command, params);
    }
}
class KareeCommandConfig {

    commandModule = {}

    constructor(){
        this.config();
    }

    config(){
        Yargs
            .command('create', 'Create a new Flutter project with MVC pattern using Karee')
            .command('generate', 'Generate a new screen or a new controller',
                {
                    screen: {
                        description: 'Generate a new screen',
                        alias: 's',
                        choices: ['stateless', 'stateful', 'stl', 'stf'],

                        
                    },
                    controller: {
                        
                    }
                }
            )
    }

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