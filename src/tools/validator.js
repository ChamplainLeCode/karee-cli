class Validator{


    static validateName(val = ''){
        if(val.length > 0 && val.match(/[a-zA-Z][a-zA-Z_0-9]*/)?.join('') === val)
            return val
        return null
    }
    static version(val = ''){
        if(val.length > 0 && val.match(/^((\d+\.)?(\d+\.)?(\*|\d+)((\-|)[a-zA-Z0-9]{1,10}){0,1})/)?.join('') === val)
            return val
        return null
    }
}

module.exports = Validator