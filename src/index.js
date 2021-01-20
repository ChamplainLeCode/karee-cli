#!/usr/bin/env node
const installer = require('./modules/installer')






/**
 * Il y a une commande si il y a 3 args aumoins 
 */
if(process.argv.length > 2){
    switch (process.argv[2]) {
        case 'create':
            installer
                .install({
                    callback: (status) => process.exit(status)
                });
        default:
            break;
    }
}

