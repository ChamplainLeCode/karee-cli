#!/usr/bin/env node

// const commander = require('./modules/index').configurer;

// const yargs = require('yargs');

const installer = require('./modules/installer')
const KareeGenerator = require('./modules/generator');
const { KareeSourceGen, KareeBuilder } = require('./modules/run_build');
const { exit } = require('yargs');
const { __config } = require('./models/karee_config');
const io = require('./io/io');

// commander.use('create', installer)
// commander.use('generate', genScreen)


// commander.launch()
// /**
//  * Il y a une commande si il y a 3 args aumoins 
//  */
// if(process.argv.length > 2){
//     switch (process.argv[2]) {
//         case 'create':
//             installer
//                 .install({
//                     callback: (status) => process.exit(status)
//                 });
//         default:
//             break;
//     }
// }

// const { alias } = require('yargs');
// const yargs = require('yargs');

// const argv = yargs(process.argv.slice(2))
//     .command('create', 'Create a new Flutter project that uses MVC pattern with Karee architecture', {})
//     .command('generate', 'Generate a new screen or controller in your application', {
//         screen: {
//             description: 'Generate a new screen for your apps',
//             alias: 's',
//             option: {
//                 stateful: {
//                     description: ' Generate a screen that extends Stateful Widget',
//                     alias: 'f'
//                 }
//             }
//         }
//     }
    
//     )
//     .help()
//     // .alias('help', 'h')
//     .argv;

const argv = require('yargs/yargs')(process.argv.slice(2))

            .command({
                command: '\x1b[33m\x1b[1mcreate\x1b[0m',
                aliases: ['create'],
                describe: 'Create a new Flutter projet that using MVC Pattern based on Karee\n\n',
                handler: (argv) => {
                    installer.install({
                        callback: (status) => process.exit(status)
                    })
                }, 
            })
            .command({
                command: '\x1b[33m\x1b[1mbuild\x1b[0m',
                aliases: ['build','b'],
                describe: 'The build command help you to build a realease of your application. This use flutter build command\n\n',
                handler: (argv) => {
                    let kareeRunner = new KareeBuilder()
                    kareeRunner.build(() => exit(0))
                }, 
            }).command({
                command: '\x1b[33m\x1b[1mgenerate\x1b[0m [--options] \x1b[34m\x1b[1m<className>\x1b[0m',
                aliases: ['generate', 'g'],
                describe: '\
                        Generate an item. Items that can be generate are \x1b[32m\x1b[1mscreen\x1b[0m and \x1b[32m\x1b[1mcontroller\x1b[0m\n\n\
                        🏉 To generate a screen add \x1b[35m\x1b[1m--screen\x1b[0m or \x1b[35m\x1b[1m-s\x1b[0m option\n\
                        ---👍 add the path where to generate your screen from \x1b[1mapp/screens/\x1b[0m directory with \x1b[35m\x1b[1m--path\x1b[0m or \x1b[35m\x1b[1m-p\x1b[0m.\n\
                        ---👍 After setting up path you have to define the name of your screen with \x1b[35m\x1b[1m--name\x1b[0m or \x1b[35m\x1b[1m-n\x1b[0m option\n\
                        ---👍 Finally indicate the type of Widget your screen extends from. \x1b[35m\x1b[1m--stateful\x1b[0m or \x1b[35m\x1b[1m-f\x1b[0m for Stateful Widget or \x1b[35m\x1b[1m--stateless\x1b[0m or \x1b[35m\x1b[1m-l\x1b[0m for Stateless\n\n\
                        🏉 To Generate a controller add \x1b[35m\x1b[1m--controller\x1b[0m or \x1b[35m\x1b[1m-c\x1b[0m option\n\
                        ---👍 add the path where to generate your screen from \x1b[1mapp/controllers/\x1b[0m directory with \x1b[35m\x1b[1m--path\x1b[0m or \x1b[35m\x1b[1m-p\x1b[0m.\n\n',
                handler: (argv) => {
                    //console.log(argv)
                    let generator = new KareeGenerator();
                    generator.generate({
                        callback: (status) => exit(status),
                        options: argv
                    })
                }
            })
            .command({
                command: '\x1b[33m\x1b[1mlanguage\x1b[0m',
                aliases: ['lang'],
                describe: 'Set up the language of your CLI\n\n',
                handler: async (argv) => {
                    var lang = await io
                        .getList('Setup the language of karee CLI', ['French (fr)', 'English(en)'])
                    if(lang.indexOf('(en)') > -1){
                        __config.json.lang = "en";
                    }else{
                        __config.json.lang = "fr";
                    }
                    __config.export()
                }, 
            })
            .command({
                command: '\x1b[33m\x1b[1msource\x1b[0m',
                aliases: ['source','s'],
                describe: 'This command help you to generate additionals files used by Karee when you want to run your project\n\n',
                handler: (argv) => {
                    const sourceGen = new KareeSourceGen()
                    sourceGen.generateSource()
                }, 
            })
            .command({
                command: '\x1b[33m\x1b[1mrun\x1b[0m',
                aliases: ['run','r'],
                describe: 'The run command help you to run  your application. This use flutter run command\n\n',
                handler: (argv) => {
                    let kareeRunner = new KareeBuilder()
                    kareeRunner.run(() => exit(0))
                }, 
            })
            .options({
                controller: {
                    alias: 'c',
                    describe: 'This option is used with generate command, it means you want to generate a controller',
                    nargs: 0
                },
                class: {
                    describe: 'This option is used with generate command, it means you want to generate a controller',
                },
                screen: {
                    alias: 's',
                    describe: 'Used with generate command where type is screen, it indicates you want to generate a screen',
                    nargs: 0
                },
                stateless: {
                    alias: 'l',
                    describe: 'This indicate to generate command that you want your screen extends Flutter Stateless Widget',
                    nargs: 0
                },
                stateful: {
                    alias: 'f',
                    describe: 'This indicate to generate command that you want your screen extends Flutter Stateful Widget',
                    nargs: 0
                },
                path: {
                    alias: 'p',
                    describe: 'The path at where to generate screen or controller',
                    nargs: 1
                },
                name: {
                    alias: 'n',
                    describe: 'The name of screen that should be generate',
                    nargs: 1
                }
            })
            // provide a minimum demand and a minimum demand message
            .demandCommand(1, 'You need at least one command before moving on')
            .help()
            .argv

// console.log(argv);
