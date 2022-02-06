const handleChange = require('./handlefilechanged')
const handleDeleteFile = require('./removefilehandler')
const newFileUpdate =  require('./addfilehandler')


module.exports =  {change:handleChange, deletefile:handleDeleteFile, add:newFileUpdate}

