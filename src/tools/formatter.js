function cambelToUnderscore(name = '') {
    let response = '';
    for (let index = 0; index < name.length; index++) {
        let char = name.charAt(index)
        if(isUpper(char)){
            response = response+(index == 0 ? '' : '_')+char.toLowerCase()
        }else{
            response = response+char
        }
    }
    return response
}

function underscoreToCambel(name = '') {
    let response = '';
    for (let index = 0; index < name.length; index++) {
        let char = name.charAt(index)
        char = index == 0 && !isUpper(char) ? char.toUpperCase() : char
        if(char == '_'){
            response = response+(index +1 < name.length ? name.charAt(index+1).toUpperCase() : '')
            index++
        }else{
            response = response+char
        }
    }
    return response
}

function isUpper(char = '') {
    return char.charCodeAt() >= 65 && char.charCodeAt() <= 90
}



module.exports = {
    cambelToUnderscore,
    underscoreToCambel
}