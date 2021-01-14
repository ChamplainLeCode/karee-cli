const r = require('inquirer')


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

}

module.exports = new IO();