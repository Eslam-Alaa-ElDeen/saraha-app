import multer from "multer"
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto"
import { resolve } from "node:path"
import { fileTypeFromBuffer } from "file-type";
import { BadRequestException } from "../../exception/error.exception.js";



export const fileTypeValidation={
    image:['image/jpeg','image/png','image/gif','image/jpg'],
    files:["application/json","application/pdf"]
}


export const localFileUpload=({customPath="general",customTypes=[]})=>{
    const storage=multer.memoryStorage()
    const upload=multer({storage,limits:{
        fileSize:(5*1024*1024)
    }})
    return upload;
}

//ensure the file extention matched with file content
export const processFile=async({validation=[],customPath='general',file}={})=>{
    const pathFolder=`uploads/${customPath}`
    await fs.mkdir(pathFolder,{recursive:true})

    const result=await fileTypeFromBuffer(file.buffer)

    if(!result || !validation.includes(result.mime)){
        throw BadRequestException({message:"Invalid file formate"})
    }else{
        const uniqueFilePath=`${pathFolder}/${randomUUID()}.${result.ext}`
        await fs.writeFile(resolve(`${uniqueFilePath}`),file.buffer)
        file.finalPath=uniqueFilePath;
        return file;
    }
}

export const processFiles=async({validation=[],customPath='general',files}={})=>{
    let uploaded=[]
    for (const file of files) {
        const upload=await processFile({
            validation,
            customPath,
            file
        })
        uploaded.push(upload.finalPath)
    }

    return uploaded
}

export const processFields=async({validation=[],customPath='general',fields}={})=>{
    let uploaded=[]
    for (const field of Object.keys(fields)) {
        const uploads=await processFiles({
            validation,
            customPath,
            files:fields[field]
        })
        uploaded.push({field,uploads})
    }

    return uploaded
}

export const processMulterUpload=async({req,validation=[],customPath='general'}={})=>{

        if(req.file){
            await processFile({
                validation,
                customPath,
                file:req.file
            })
            req.filePath = req.file.finalPath;
        }else if(Array.isArray(req.files)){
            const returnedFiles=await processFiles({
                validation,
                customPath,
                files:req.files
            })
            req.filesPaths=returnedFiles
        }else if(typeof req.files=="object" && Object.keys(req.files)?.length){
            const returnedFiles=await processFields({
                validation,
                customPath,
                fields:req.files
            })
            req.filesPaths=returnedFiles
        }
}




