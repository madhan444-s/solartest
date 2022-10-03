import config from './config';
import showToasterMessage from '../containers/UI/ToasterMessage/toasterMessage';
import SessionExpiryModal from '../containers/Cruds/CommonModals/SessionexpiryModal'
let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

// To get logged in user token
const getLoggedInuserToken = () => {
    let userData = localStorage.getItem('loginCredentials');
    userData = JSON.parse(userData);
    if (userData) {
        headers.Authorization = `Bearer ${userData.accessToken}`;
        headers.logggedInUserData = {
            email: userData.email,
            password: userData.password,
        }
        return headers;
    } else {
        return headers;
    }
}

const fetchMethodRequest = (method, url, body, type) => {
    if (url === 'auth/login') {
        return sendRequestToServer(method, url, body, headers);
    } else {
        let headers = getLoggedInuserToken();
        // upload method conditions, headers
        if (type && type == 'upload') {
            let formData = new FormData();
            if (body) {
                formData.append('file', body);
            }
            if (headers.logggedInUserData) {
                delete headers.logggedInUserData;
            }
            body = {
                isUploadingImage: true,
                imageInfo: formData,
            }
        }
        return sendRequestToServer(method, url, body, headers)
            .then(response => {
                if (response) {
                    if (response.errorCode && response.errorCode === 9001) { // token expiry
                        return response;
                    } else {
                        return response;
                    }
                }
            })
            .catch((err) => {
                // console.log('error ' + err)
            });
    }
}

// generate guid and update headers
const sendLoginRequestForToken = (method, url, body) => {
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    return sendRequestToServer(method, url, body, headers).then(response => {
        if (response) {
            if (response.respCode && response.respCode === 200) {
                let tokenInfo = {
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                    tokenExpires: response.tokenExpires
                }
                let userData = { ...body, ...tokenInfo };
                // save user credentials in storage
                headers.Authorization = `Bearer ${userData.accessToken}`;

                // To set logged in doctor details
                let userDetails = response.details;
                if (userDetails && userDetails._id) {
                    // localStorage.setItem("loggedInUserDetails", JSON.stringify(userDetails));

                    userData._id = userDetails._id;
                    localStorage.setItem("loginCredentials", JSON.stringify(userData));
                }

                return headers;
            } else if (response.errorCode) {
                // move user to login screen
                return 9002; // login request failed
            }
        } else {
            return null;
        }
    });
}

const sendRequestToServer = (method, url, body, headers) => {
    let reqHeaders = { ...headers };

    if (reqHeaders && reqHeaders.logggedInUserData) {
        delete reqHeaders.logggedInUserData;
    }
    let isImageReqSent = false;
    let request;

    if (body && body.isUploadingImage) { // only for image upload
        isImageReqSent = true;
        request = fetch(`${config.apiUrl}${url}`, {
            method: method,
            headers: {
                'Authorization': `${reqHeaders.Authorization}`
            },
            body: body.imageInfo
        })

    }
    // console.log(method, body, `${config.apiUrl}${url}`);
    // console.log(reqHeaders);
    if (!isImageReqSent) { // send request for call except image upload 
        if (method === 'GET' || method === 'DELETE') {
            request = fetch(`${config.apiUrl}${url}`, { method: method, headers: reqHeaders })
        } else if (method === 'POST' || method === 'PUT') {
            request = fetch(`${config.apiUrl}${url}`, { method: method, headers: reqHeaders, body: JSON.stringify(body) })
        }
    }

    return request.then(res => res.json())
        .then(responseJson => {

            if (responseJson && responseJson['errorMessage'] == "Session expired please login again.") {
                localStorage.setItem('sessionexpired', true)
            }
            // console.log(responseJson);
            return responseJson;
        }).catch(err => {
            showToasterMessage(config.serverErrMessage, 'error');
            return 'serverError';
        });
}
export default fetchMethodRequest;
