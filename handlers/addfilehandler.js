const path = require('path')
const Get_Cloud_File = require('../network/getCloudFile')
const { createReadStream } = require('fs')
const Drive = require('../network/getDrive')
const map = require('../utils/mapper.json')
const path_to_config = process.cwd() + '/config.json'
const config = require(path_to_config)
const changed = require('./handlefilechanged')

// console.log(config, path_to_config)
const add_new_file = async (parents, name, uploadType, requestBody = {}, _path_to_file, ext = '.csv') => {
    return new Promise(async (resolve, reject) => {
        Drive.files.create({
            enforceSingleParent: true,
            media: {
                body: createReadStream(_path_to_file, { encoding: 'utf8', autoClose: true }),
                mimeType: map[ext]
            },
            requestBody: {
                parents: [parents],
                name,
                ...requestBody
            }
        })
            .then((g_response) => {
                resolve(g_response)
            }).catch((reason) => {
                reject(reason)
            })


    })


}
const addFileHandler = async (pathname, requestBody = {}, cloud_parent ='1uRX_JozrsEhLm_mpGORtmINZlyV8QzjT') => {
    let file_name = path.basename(pathname)
    let extension = path.extname(pathname)
    let file = {}
    let check_is_exist = await Get_Cloud_File(file_name, map[extension], cloud_parent).catch((reason) => { return reason })
    if (check_is_exist.length === 0) {
        let parent = await Get_Cloud_File(config.DEFAULT_STORAGE_NAME, 'application/vnd.google-apps.folder').catch((reason) => { return reason })
        if (parent.length === 1) {
            let new_file = await add_new_file(parent[0].id, file_name, 'multipart', requestBody, pathname, extension).catch((reason => { return reason }))
            file = new_file
            console.log(new_file.data.name, ' Updated inside cloud')
        } else {
            console.log('Something went wrong with cloud upload.', parent)
        }
        
    } else {
        await changed(pathname).then(() => { console.log('Update complete') }).catch((reason) => { console.log('Could not update file.') })   
    }
}
module.exports = addFileHandler