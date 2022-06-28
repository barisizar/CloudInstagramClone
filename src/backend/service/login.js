var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'serverless-users';

const resp = require('../utils/resp');
const auth = require('../utils/auth');
const bcrypt = require('bcryptjs');

async function login(user){
    const username = user.username;
    const password = user.password;
    if(!username || !password){
        return resp.buildResponse(401, {
            message: 'Username and password are required.'
        });
    }

    const dynamoUser = await getUser(username.toLowerCase().trim());
    if(!dynamoUser || !dynamoUser.username){
        return resp.buildResponse(403, {
            message: 'Username does not exist.'
        });
    }

    if(!bcrypt.compareSync(password, dynamoUser.password)){
        return resp.buildResponse(403, {
            message: 'Password is incorrect.'
        });
    }

    const userInfo = {
        username: dynamoUser.username,
        name: dynamoUser.name
    }
    const token = auth.generateToken(userInfo);
    const response = {
        user: userInfo,
        token: token
    };

    return resp.buildResponse(200, response);
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
        console.log('There is an error: ', error);
    });
}

module.exports.login = login;