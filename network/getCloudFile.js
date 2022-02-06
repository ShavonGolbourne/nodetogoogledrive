const Drive = require('../network/getDrive')

// console.log(Drive)
const Get_Cloud_File = async (file_name = '', mimeType = '', parent = '1ZR0TDZWG315WQhF_giL8FYlWbnbxdnX6', trashed=false, )=>{
    return new Promise((resolve, reject)=>{
        let query = `name contains '${file_name}' and trashed=${trashed} and mimeType='${mimeType}' and parents='${parent}'`
        Drive.files.list({
            q:query,
            spaces: 'drive',
        
        }).then(({data:{files}})=>{
            resolve(files)
        }).catch((reason)=>{
            reject(reason)
        })

    })

}

module.exports = Get_Cloud_File