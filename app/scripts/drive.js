/**
* Drive API integration.
*/

var DriveHandler = function(window) {
  this.window_ = window;

  this.gapiLoadedPromise_ = new Promise(function(resolve, _) {
    window['onGapiLoaded'] = function() {
      delete window['onGapiLoaded'];
      resolve();
    };
  });

  this.appId_ = null;

  this.loadGapi_();
  this.attachToLoginButton_();
};

DriveHandler.CLIENT_ID =
    '500289328726-fspr8gpesoffed580t339jo1ugunviat.apps.googleusercontent.com';
DriveHandler.SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.appfolder',
  'email', 'profile'
];

DriveHandler.prototype.loadGapi_ = function() {
  var gapiScript = document.createElement('script');
  gapiScript.setAttribute(
      'src', 'https://apis.google.com/js/client.js?onload=onGapiLoaded');
  document.body.appendChild(gapiScript);
};

DriveHandler.prototype.attachToLoginButton_ = function() {
  document.querySelector('drive-login').addEventListener(
      'click', this.handleLoginClick_.bind(this));
};

DriveHandler.prototype.handleLoginClick_ = function() {
  this.gapiLoadedPromise_.then(() => {
    gapi.auth.authorize({
      'client_id': DriveHandler.CLIENT_ID,
      'scope': DriveHandler.SCOPES,
      'immediate': false
    }, this.handleAuthResult_.bind(this));
  });
};

DriveHandler.prototype.handleAuthResult_ = function(authResult) {
  if (authResult) {
    // Access token has been successfully retrieved, requests can be sent to the API
    console.log('got auth result', authResult);

    // Success!
    this.initialize_();
  } else {
    // No access token could be retrieved, force the authorization flow.
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
        handleAuthResult);
  }
};

DriveHandler.prototype.initialize_ = function() {
  this.appId_ = new Promise((resolve, reject) => {
    gapi.client.load('drive', 'v2', resolve)
  }).then(() => new Promise((resolve, reject) => {
    gapi.client.drive.files.get({'fileId': 'appfolder'}).execute(resolve);
  })).then((resp) => {
    // TODO: cache ID of 'appfolder' folder in local storage.
    console.log('Id: ' + resp.id);
    console.log('Title: ' + resp.title);
    return resp.id;
  }).then((folderId) => new Promise((resolve, reject) => {
    gapi.client.drive.children.list({'folderId': folderId}).execute(resolve);
  })).then((resp) => {
    console.log('listed folders!');
    console.log(resp);
  });
};

module.exports = DriveHandler;
