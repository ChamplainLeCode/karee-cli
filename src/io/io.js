const r = require('inquirer')
const fs = require('fs');
const fs_extra = require('fs-extra')

class IO {

    async getText(question = null, defaultAnswer = '' ) {

        if (question == null)
            throw new Error('Question name is missing')
        let answer = await r.prompt([
            {
                type: 'input',
                name: 'value',
                message: question,
                default: defaultAnswer
            }
        ])
        return answer.value;
    }

    async getList(question = null, choices = [], defaultAnswer = null ) {

        if (question == null)
            throw new Error('Question name is missing')
        let answer = await r.prompt([
            {
                type: 'list',
                name: 'value',
                message: question,
                choices: choices,
                default: defaultAnswer
            }
        ])
        return answer.value;
    }

    readFile(filename = null){

        if(filename == null)
            new Error('File name cannot be null');
        return JSON.parse(fs.readFileSync(filename,  'utf-8').toString());
    }

    writeFile(content, filename){
        fs.writeFileSync(filename, content, 'utf-8');
    }

    move(oldPath, newPath){
        fs_extra.moveSync(oldPath, newPath)
    }

    delete(path){
        fs.rmdirSync(path, {recursive: true})
    }

}

module.exports = new IO();