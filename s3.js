const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");
require("dotenv").config();

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

// initialize a new instace of the s3 object using our credentials so we can access the bucket
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});

// IMAGE FUNCTIONS ================================================

deleteImage = (userId, filekey) => {
    const deleteParams = {
        Key: `${userId}/image/${filekey}`,
        Bucket: bucketName
    }
    return s3.deleteObject(deleteParams).promise();
}

uploadImage = (userId, file) => {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: `${userId}/image/${file.filename}`
    }
    return s3.upload(uploadParams).promise();
}

getImageStream = (userId, fileKey) => {
    const downloadParams = {
        Key: `${userId}/image/${fileKey}`,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}

// PDF FUNCTIONS =========================================================

uploadPDF = (userId, filename) => {
    const readStream = fs.createReadStream(`user-forms/${filename}`)
    const uploadParams = {
        Bucket: bucketName,
        Body: readStream,
        Key: `${userId}/forms/${filename}`,
        contentType : "application/pdf"
    }
    return s3.upload(uploadParams).promise();
    
}

deleteForms = (userId, filekey) => {
    const deleteParams = {
        Key: `${userId}/forms/${filekey}`,
        Bucket: bucketName
    }
    return s3.deleteObject(deleteParams).promise();
}

getPDFStream = (userId, fileKey) => {
    const downloadParams = {
        Key: `${userId}/forms/${fileKey}`,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}




module.exports = {deleteImage, uploadImage, getImageStream, uploadPDF,  deleteForms, getPDFStream};









