const response = (message,code,data) => {
    return ({message,data: data || null,code})
}

module.exports = {
    response
}