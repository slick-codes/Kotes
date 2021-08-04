const symbols = '!@#$%^&*()_+}{|?\'\\<>:;`~+=-_'.split('')

function isIncludeSymbols(str, except = []) {
    if (!Array.isArray(except))
        throw new Error('exception needs to be an array of symbols')
    str = str.split('')
    const filteredSymbols = symbols.filter(symbol => !except.includes(symbol))
    console.log(filteredSymbols)
    return str.some(char => filteredSymbols.includes(char))
}



module.exports = {
    isIncludeSymbols
}
