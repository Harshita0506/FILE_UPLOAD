const File = require ("../models/File");
const cloudinary =require("cloudinary").v2;
//const path =require("path");

const localFileUpload =async (req , res) =>{
    try{
        const file =req.files.file;
        console.log("FILE AAGYI JEE ->",file);

        let path =__dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        file.mv(path , (err) =>{
            console.log(err);
        });

        res.json({
            success:true,
            message:'Local file uploaded successfully',
        });

    }
    catch(error){
        console.log("not able to upload file successfully on server");
        console.log(error);
    }
};

function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder , quality)
{   const options ={folder};

    if(quality)
    {
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}
//image upload ka handler
const imageUpload = async (req ,res) =>{
    try{
        const {name , tags , email} =req.body;
        console.log(name, tags, email);

        const file=req.files.imageFile;
        console.log(file);

        const supportedTypes= ["jpg","jpeg","png"];
        const fileType =file.name.split('.')[1].toLowerCase();
        
        if(!isFileTypeSupported(fileType ,supportedTypes))
        {
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        console.log("Uploading to Codehelp");
        const response = await uploadFileToCloudinary(file,"Codehelp");
        console.log(response);

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })


        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image Successfully Uploaded',
        })
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })
    }
}

//video upload ka handler
const videoUpload= async (req ,res) =>{
    try{
        const {name , tags , email} =req.body;
        console.log(name, tags, email);

        const file=req.files.videoFile;

        const supportedTypes= ["mp4","mov" ,"rar"];
        const fileType =file.name.split('.')[1].toLowerCase();
        
        if(!isFileTypeSupported(fileType ,supportedTypes))
        {
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        console.log("Uploading to Codehelp");
        const response = await uploadFileToCloudinary(file,"Codehelp");
        console.log(response);

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })


        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Video Successfully Uploaded',
        })
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })
    }
}

//to reduce image size  
const imageSizeReducer = async (req ,res) =>{
    try{
        const {name , tags , email} =req.body;
        console.log(name, tags, email);

        const file=req.files.imageFile;
        console.log(file);

        const supportedTypes= ["jpg","jpeg","png"];
        const fileType =file.name.split('.')[1].toLowerCase();
        
        if(!isFileTypeSupported(fileType ,supportedTypes))
        {
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        console.log("Uploading to Codehelp");
        const response = await uploadFileToCloudinary(file,"Codehelp",30);
        console.log(response);

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })


        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image  size reduced Successfully Uploaded',
        })
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })
    }
}

module.exports = {localFileUpload ,imageUpload,videoUpload ,imageSizeReducer};