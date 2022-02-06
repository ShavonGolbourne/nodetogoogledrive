const oAuth2Client = require('./cloud')
const {google} =require('googleapis')

let token_path = process.cwd() + '/token.json'
let credentials = process.cwd() + '/cred.json'
module.exports = google.drive({version:'v3', auth:oAuth2Client(token_path, credentials)})