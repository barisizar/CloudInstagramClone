var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'serverless-users';

const resp = require('../utils/resp');
const bcrypt = require('bcryptjs');

async function register(userInfo){
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;
    if(!username || !email || !name || !password){
        return resp.buildResponse(401, {
            message: 'All fields are required.'
        });
    }

    const dynamoUser = await getUser(username);
    if(dynamoUser && dynamoUser.username){
        return resp.buildResponse(401, {
            message: 'Username already exists, use a different one instead.'
        });
    }

    const encryptedPW = bcrypt.hashSync(password.trim(), 10);
    const user = {
        name: name,
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPW,
        posts: [],
        likedPosts: []
    };

    const saveUserResponse = await saveUser(user);
    if(!saveUserResponse){
        return resp.buildResponse(503, {
            message: 'Server Error. Please try again later.'
        });
    }
    return resp.buildResponse(200, {username: username});
}

async function saveUser(user){
    const params = {
        TableName: userTable,
        Item: user
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.log('There is an error saving user in database: ', error);
    });
}

async function getUser(username){
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    }
    return await dynamodb.get(params).promise().then(response =>{
        return response.Item;
    }, error => {
        console.log('There is an error getting user in database: ', error);
    });
}

module.exports.register = register;