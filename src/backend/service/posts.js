var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'serverless-users';
const postTable = 'serverless-posts';

const fileProcessing = require('../utils/fileProcessing')

async function createUserPost(postInfo) {
    // check if username exist
    const dynamoUser = await getUser(postInfo.username);
    if(!dynamoUser || !dynamoUser.username){
        return resp.buildResponse(401, {
            message: 'User does not exist.'
        });
    }

    // upload to s3
    const uploadBody = {
        fileName: postInfo.fileName,
        filePath: postInfo.filePath,
    }
    const ret_params = await fileProcessing.uploadPhoto(uploadBody);

    // create post struct
    const post = {
        fileName: ret_params.Key,
        username: postInfo.username,
        creationDate: new Date(),
        upvotes: []
    }
    
    // save post in dynamo
    const savePostResponse = await savePost(post);
    if(!savePostResponse){
        return resp.buildResponse(503, {
            message: 'Server Error. Please try again later.'
        });
    }

    // add post name to user post list
    var new_post_list = dynamoUser.posts;
    new_post_list.push(post.fileName);

    // update user with new data
    const updateUserResponse = await updateUser(dynamoUser.username, dynamoUser.posts, new_post_list);
    if(!updateUserResponse){
        return resp.buildResponse(503, { 
            message: 'Server Error. Please try again later.'
        });
    }
    
    // return 200 response
    return resp.buildResponse(200);
}

async function deleteUserPost(eventBody) {
    // check if username exist
    const dynamoUser = await getUser(eventBody.username);
    if(!dynamoUser || !dynamoUser.username){
        return resp.buildResponse(401, {
            message: 'User does not exist.'
        });
    }

    // check if post file name exist
    const dynamoPost = await getUser(eventBody.fileName);
    if(!dynamoPost || !dynamoPost.fileName){
        return resp.buildResponse(401, {
            message: 'Post does not exist.'
        });
    }

    // delete photo from s3
    const deletePhotoResponse = await fileProcessing.deletePhoto(eventBody.fileName);
    if(!deletePhotoResponse){
        return resp.buildResponse(503, {
            message: 'Server Error. Please try again later.'
        });
    }

    // delete post from database table
    const deletePostResponse = await deletePost(eventBody.fileName);
    if(!deletePostResponse){
        return resp.buildResponse(503, {
            message: 'Server Error. Please try again later.'
        });
    }

    // remove post name from user posts list
    const index_post = dynamoUser.posts.indexOf(dynamoPost.fileName);
    if(index_post <= -1){
        return resp.buildResponse(401, {
            message: 'Could not delete user post.'
        });
    }
    const new_post_list = dynamoPost.posts.splice(index_post, 1);

    // update user with new post list
    const updateUserResponse = await updateUser(updated_user.username, dynamoUser.posts, new_post_list);
    if(!updateUserResponse){
        return resp.buildResponse(503, {
            message: 'Server Error. Please try again later.'
        });
    }

    return resp.buildResponse(200);
}

async function upvotePost(eventBody) {
    // check if username exist
    const dynamoUser = await getUser(eventBody.username);
    if(!dynamoUser || !dynamoUser.username){
        return resp.buildResponse(401, {
            message: 'User does not exist.'
        });
    }

    // check if post file name exist
    const dynamoPost = await getUser(eventBody.fileName);
    if(!dynamoPost || !dynamoPost.fileName){
        return resp.buildResponse(401, {
            message: 'Post does not exist.'
        });
    }

    // add post name to user likedPosts list
    var new_likedPosts_list = dynamoUser.likedPosts;
    new_likedPosts_list.push(post.fileName);

    // update user with new data
    const updateUserResponse = await updateUser(dynamoUser.username, dynamoUser.likedPosts, new_likedPosts_list);
    if(!updateUserResponse){
        return resp.buildResponse(503, {
            message: 'Server Error. Please try again later.'
        });
    }

    // add username to post upvotes list
    var new_upvotes_list = dynamoPost.upvotes;
    new_upvotes_list.push(dynamoUser.username);

    // update user with new data
    const updatePostResponse = await updateUser(dynamoPost.fileName, dynamoPost.upvotes, new_upvotes_list);
    if(!updatePostResponse){
        return resp.buildResponse(503, {
            message: 'Server Error. Please try again later.'
        });
    }

    return resp.buildResponse(200);
}

async function downvotePost(eventBody) {
    // check if username exist
    const dynamoUser = await getUser(eventBody.username);
    if(!dynamoUser || !dynamoUser.username){
        return resp.buildResponse(401, {
            message: 'User does not exist.'
        });
    }

    // check if post file name exist
    const dynamoPost = await getUser(eventBody.fileName);
    if(!dynamoPost || !dynamoPost.fileName){
        return resp.buildResponse(401, {
            message: 'Post does not exist.'
        });
    }

    // remove post name from user likedPosts list
    const index_post = dynamoUser.likedPosts.indexOf(dynamoPost.fileName);
    if(index_post <= -1){
        return resp.buildResponse(200);
    }
    const new_likedPosts_list = dynamoUser.likedPosts.splice(index_post, 1);

    // update user with new likedPosts list
    const updateUserResponse = await updateUser(dynamoUser.username, dynamoUser.likedPosts, new_likedPosts_list);
    if(!updateUserResponse){
        return resp.buildResponse(503, {
            message: 'Server Error. Please try again later.'
        });
    }

    // remove username from post upvotes list
    const index_user = dynamoPost.upvotes.indexOf(dynamoPost.upvotes);
    if(index_post <= -1){
        return resp.buildResponse(200);
    }
    const new_upvotes_list = dynamoPost.upvotes.splice(index_user, 1);

    // update user with new upvotes list
    const updatePostResponse = await updatePost(dynamoPost.fileName, dynamoPost.upvotes, new_upvotes_list);
    if(!updatePostResponse){
        return resp.buildResponse(503, {
            message: 'Server Error. Please try again later.'
        });
    }

    return resp.buildResponse(200);
}

async function getUser(username){
    const params = {
        TableName: userTable,
        Key: {
            'username': username
        }
    }
    return await dynamodb.get(params).promise().then(response =>{
        return response.Item;
    }, error => {
        console.log('There is an error getting user in database: ', error);
    });
}

async function updateUser(username, updateKey, updateValue){
    const params = {
        TableName: userTable,
        Key: {
            'username': username
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
          ':value': updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then(() => {
        return true;
    }, error => {
        console.log('There is an error update user in database: ', error);
    });
}

async function getPost(fileName){
    const params = {
        TableName: postTable,
        Key: {
            'fileName': fileName
        }
    }
    return await dynamodb.get(params).promise().then(response =>{
        return response.Item;
    }, error => {
        console.log('There is an error getting post in database: ', error);
    });
}

async function savePost(post){
    const params = {
        TableName: postTable,
        Item: post
    }
    return await dynamodb.put(params).promise().then(response => {
        return true;
    }, error => {
        console.log('There is an error saving post in database: ', error);
    });
}

async function updatePost(fileName, updateKey, updateValue){
    const params = {
        TableName: postTable,
        Key: {
            'fileName': fileName
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
          ':value': updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then(response => {
        return true;
    }, error => {
        console.log('There is an error updating post in database: ', error);
    });
}

async function deletePost(fileName){
    const params = {
        TableName: postTable,
        Key: {
            'fileName': fileName
        },
        ReturnVlaues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then(response => {
        return true;
    }, error => {
        console.log('There is an error deleting post in database: ', error);
    });
}

module.exports.createUserPost = createUserPost;
module.exports.deleteUserPost = deleteUserPost;
module.exports.upvotePost = upvotePost;
module.exports.downvotePost = downvotePost;
