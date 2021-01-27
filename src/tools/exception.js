const { exit } = require("yargs");

class KareeException {


    notKareeProject(){
        console.log('\n\x1b[31m\x1b[1mFatal Error: This is not a Karee project\x1b[0m\n');
        exit(17)
    }

    log(msg){
        console.log(`\n${msg}\n`)
        exit(18)
    }
}

module.exports = new KareeException()