var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

const s3 = new AWS.S3();
const bucketName = 'serverless-file-upload';

const resp = require('./resp');
const fs = require('fs');

async function uploadPhoto(requestBody){
    const fileName = requestBody.file.fileName;
    const filePath = requestBody.file.filePath;
    const fileStream = fs.createReadStream(filePath);

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileStream,
        ContentType: 'image/jpeg'
    };
    return await s3.upload(params).promise().then(response => {
        return params;
    }, error => {
        console.log('Could not upload photo in S3: ', error);
    });
}

async function deletePhoto(fileName){
    const params = {
        Bucket: bucketName,
        Key: fileName
    };
    return await s3.deleteObject(params).promise().then(response => {
        return true;
    }, error => {
        console.log('Could not delete element from S3 bucket: ', error);
    });
}

function getPhotoStream(key){
    const downloadParams = {
        Key: key,
        Bucket: bucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
}


module.exports.uploadPhoto = uploadPhoto;
module.exports.getPhotoStream = getPhotoStream;
module.exports.deletePhoto = deletePhoto;