class Validator{


    static validateName(val = ''){
        if(val.length > 0 && val.match(/[a-z][a-z_0-9]*/)?.join('') === val)
            return val
        return null
    }
    static validateVersion(val = ''){
        let match = val.match(/^\d+\.\d+\.\d+-{0,1}[a-zA-Z0-9]{0,20}/)?.join('')
        if(val.length > 0 && match === val)
            return val
        return null
    }
}

module.exports = Validator