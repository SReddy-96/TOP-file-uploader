const db = require('../db/queries');

const deleteFilesFromFolder = async(folderId)=>{
    try {
        const folder = await db.getFolderById(folderId);
        let files;
        if (!folder) {
            const err = new Error("Folder not found");
            err.statusCode = 404;
            throw err;
        }
        
    } catch (error) {
            error.statusCode = error.statusCode || 500;
    next(error);
    }
}

module.exports = deleteFilesFromFolder;