class Validator{


    static validateName(val = ''){
        if(val.length > 0 && val.match(/[a-zA-Z][a-zA-Z_0-9]*/)?.join('') === val)
            return val
        return null
    }
    static validateVersion(val = ''){
        console.log(/^\d+\.\d+\.\d+([-]{0,1}[a-zA-Z0-9]+)*/.compile().test(val));
        let match = val.match(/^\d+\.\d+\.\d+[-]{0,1}[a-zA-Z0-9]{1,15}/)?.join('')
        console.log('=> '+match)
        if(val.length > 0 && match === val)
            return val
        return null
    }
}

module.exports = Validator