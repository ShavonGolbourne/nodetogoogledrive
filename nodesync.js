const chokidar = require('chokidar')
const print = console.log.bind(console)
const {change, deletefile, add} = require('./handlers')
const path_to_config = process.cwd() + '/config.json'
const config = require(path_to_config)['DEFAULT_DESCRIPTION']
 let file_description = config.DEFAULT_DESCRIPTION
const fileWatcher = async (view_folders=[])=>{
    return new Promise((resolve, reject)=>{
        console.log('Application now watching folders: ', view_folders)
        const watcher = chokidar.watch([view_folders], {
            persistent: true,
            ignoreInitial: true,
            ignored: ['videos'],
            followSymlinks: true,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 200
            }
        
        })
        
        watcher.on('unlink', async path => {
            await deletefile(path).then(()=>{resolve(`File ${path} removed during sync process.`)}).catch((reason)=>reject(reason))
        })
        
        
        watcher.on('change', async path => {
            await change(path).then(()=>{resolve(`File ${path} updated during last sync process.`)}).catch((reason)=>reject(reason))
        })
        
        watcher.on('add', async path => {
            let requestBody = {
                writersCanShare: false,
                starred: true,
                description: file_description,
                hasAugmentedPermissions: true,
                resourceKey: config.RESOURCE_KEY,
                copyRequiresWriterPermission: true,
                isAppAuthorized: true,
                linkShareMetadata: {
                    securityUpdateEligible: true,
                    securityUpdateEnabled: true
                }
            }
            let new_file = await add(path, requestBody).then(()=>{resolve(`File ${path} updated during last sync process.`)}).catch((reason)=>reject(reason))
            resolve(new_file)
        })
        
    })
    
}

module.exports = fileWatcher