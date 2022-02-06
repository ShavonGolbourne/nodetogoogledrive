const path = require('path')
const Drive = require('../network/getDrive')
const print = console.log.bind(console)
const Get_Cloud_File = require('../network/getCloudFile');
const map = require('../utils/mapper.json')

const delete_from_cloud = async (fileid) => {
    return new Promise(async (resolve, reject) => {
        Drive.files.delete({ fileId: fileid }).then(({ status }) => {
            resolve(status == 204)
        }).catch(({ response }) => {
            reject(response)
        })
    })
}

const removeHandler = async (pathname, cloud_parent='1uRX_JozrsEhLm_mpGORtmINZlyV8QzjT') => {
    print(`File @ ${pathname} was removed just now.`)
    let file_name = path.basename(pathname)
    let extension = path.extname(pathname)
    let files = await Get_Cloud_File(file_name, map[extension], cloud_parent).catch((reason=>{return reason}))
    if (files.length == 1) {
        let isRemoved = await delete_from_cloud(files[0].id).catch((reason) => { print('Request failed', reason) })
        if(isRemoved){
            print('File ', file_name, ' Removed from the cloud.')
        }
    }




}

module.exports = removeHandler