const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const fileUploadService = require('./service/file-upload');
const resp = require('./utils/resp');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const fileUploadPath = '/file-upload';

exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;
    switch (true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = resp.buildResponse(200);
            break;
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = await verifyService.verify(verifyBody);
            break;
        case event.httpMethod === 'POST' && event.path === fileUploadPath:
            response = await fileUploadService.uploadPhoto(fileUploadBody);
            break;
        default:
            response = resp.buildResponse(404, '404 Not Found');
    }
    return response;
    
};
