const r = require('inquirer')
const fs = require('fs');
const fs_extra = require('fs-extra');
const exception = require('../tools/exception');

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

    readFile(filename = null, isJson = true){

        if(filename == null)
            exception.log('File name cannot be null')
        if(isJson)
            return JSON.parse(fs.readFileSync(filename,  'utf-8').toString())
        return fs.readFileSync(filename, 'utf-8').toString()
    }

    writeFile(content, filename){
        fs.writeFileSync(filename, content, 'utf-8');
    }

    exists(filename = null){
        if(filename == null)
            return false;
        return fs.existsSync(filename);
    }

    move(oldPath, newPath){
        fs_extra.moveSync(oldPath, newPath)
    }

    copy(oldPath, newPath){
        fs_extra.copyFileSync(oldPath, newPath, fs.constants.W_OK)
    }

    delete(path){
        try{
            fs.rmSync(path, {recursive: true, force: true})
        }catch(e){
            // console.log(e);
        }
    }

    projectFile(localFilePath){
        return `${__dirname}/../${localFilePath}`
    }

    createDir(path = null){
        if(fs.existsSync(path))
            return path;
        if(path == null)
            return ''
        return fs.mkdirSync(path, { recursive: true})
    }

}

module.exports = new IO();