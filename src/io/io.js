const r = require('inquirer')
const fs = require('fs');
const fs_extra = require('fs-extra');
const exception = require('../tools/exception');

/**
 * This class is used to handle all IO operations
 */
class IO {

    /**
     * Read a text from console
     * @param {*} question The question to ask.
     * @param {*} defaultAnswer The default answer if user just press enter.
     * @returns The text entered by user.
     */
    async getText(question = null, defaultAnswer = '') {

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

    /**
     * Read a text from console
     * @param {*} question The question to ask.
     * @param {*} choices The list of choices.
     * @param {*} defaultAnswer The default answer if user just press enter.
     * @returns The text entered by user.
     */
    async getList(question = null, choices = [], defaultAnswer = null) {

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

    /**
     * Read a file and return its content
     * @param {*} filename the file name to read.
     * @param {*} isJson true if the file is a json file, false for text file.
     * @returns The content of the file.
     */
    readFile(filename = null, isJson = true) {

        if (filename == null)
            exception.log('File name cannot be null')
        if (isJson)
            return JSON.parse(fs.readFileSync(filename, 'utf-8').toString())
        return fs.readFileSync(filename, 'utf-8').toString()
    }

    /**
     * Write content to a file.
     * @param {*} content The content to write.
     * @param {*} filename The file name where to write the content.
     */
    writeFile(content, filename) {
        fs.writeFileSync(filename, content, 'utf-8');
    }

    /**
     * Check if a file exists
     * @param {*} filename The file name to check.
     * @returns true if the file exists, false otherwise.
     */
    exists(filename = null) {
        if (filename == null)
            return false;
        return fs.existsSync(filename);
    }

    /**
     * Move a file from oldPath to newPath
     * @param {*} oldPath the old path of the file.
     * @param {*} newPath the new path of the file.
     */
    move(oldPath, newPath) {
        fs_extra.moveSync(oldPath, newPath)
    }

    /**
     * Copy a file from oldPath to newPath.
     * @param {*} oldPath the old path of the file.
     * @param {*} newPath the new path of the file.
     */
    copy(oldPath, newPath) {
        fs_extra.copyFileSync(oldPath, newPath, fs.constants.W_OK)
    }

    /**
     * Delete a file or a directory
     * @param {*} path the path of the file or directory to delete.
     */
    delete(path) {
        try {
            fs.rmSync(path, { recursive: true, force: true })
        } catch (e) {
        }
    }

    /**
     * Get the full path of a local file in the project
     * @param {string} localFilePath The local file path.
     * @returns The full path of the local file.
     */
    projectFile(localFilePath) {
        return `${__dirname}/../${localFilePath}`
    }

    /**
     * Create a directory and all its parent if not exists.
     * @param {string} path The path of the directory to create.
     * @returns The path of the created directory.
     */
    createDir(path = null) {
        if (fs.existsSync(path))
            return path;
        if (path == null)
            return ''
        return fs.mkdirSync(path, { recursive: true })
    }

}

module.exports = new IO();