const fs = require('fs');
const { google } = require('googleapis');
const readline = require('readline');
const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/calendar'];

function getAccessToken(oAuth2Client, TOKEN_PATH, _SCOPES, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: _SCOPES ? _SCOPES : SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, async (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), async (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        
      });
    });
    if(callback){
      callback()
    }
    return oAuth2Client
  }
  

const google_oAuth2Client = (TOKEN_PATH='', CREDENTIALS_PATH='', SCOPES=[]) => {
    let credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH))
    const authorize = (credentials) => {
        const { client_secret, client_id, redirect_uris } = credentials.web;
        let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        let token_file = fs.readFileSync(TOKEN_PATH, {encoding:'utf8', flag:'r'})
        if(token_file){
            let parsed_token = JSON.parse(token_file)
            oAuth2Client.setCredentials(parsed_token)
            return oAuth2Client
        }else{
            oAuth2Client = getAccessToken(oAuth2Client, TOKEN_PATH, SCOPES)
        }
    }
    
    return authorize(credentials)
}
module.exports = google_oAuth2Client
