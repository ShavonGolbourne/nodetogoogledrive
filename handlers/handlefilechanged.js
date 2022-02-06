const path = require('path')
const Get_Cloud_File = require('../network/getCloudFile')
const {createReadStream} = require('fs')
const Drive = require('../network/getDrive')
const map =require('../utils/mapper.json')


const update_file = async (fileId, uploadType, _path_to_file, ext='.csv') => {
    return new Promise(async (resolve, reject)=>{
        Drive.files.update(
            {
                fileId,
                uploadType, 
                media:{
                    mimeType:map[ext],
                    body:createReadStream(_path_to_file, {encoding:'utf8'})
                },
                
                requestBody:{
                    hasAugmentedPermissions:true,
                    copyRequiresWriterPermission:true,
                    starred:true,
                    writersCanShare:false,
                    
                }

            })
        .then((g_response)=>{
            console.log(`File ${fileId} updated successfully`)
            resolve(g_response)
        }).catch((reason)=>{
            reject(reason)
        })


    })
    

}

const HandleChanged = async (_path, cloud_parent='1uRX_JozrsEhLm_mpGORtmINZlyV8QzjT') =>{
    console.log(`${_path}, file changed.`)
    let file_name = path.basename(_path)
    let extension= path.extname(_path)
    const Files = await Get_Cloud_File(file_name, map[extension], cloud_parent)
    if(Files.length == 1){
        await update_file(Files[0].id, 'multipart', _path)
    }
    
    
}
module.exports = HandleChanged