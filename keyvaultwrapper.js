'use strict';

//imports
const KeyVault = require('azure-keyvault');
const AuthenticationContext = require('adal-node').AuthenticationContext;

//block vars 
let clientIdx;
let clientSecretx;
let credentials;

 /**
 *  retrieves the access token
 */
const authenticator = function (challenge, callback) {
    // Create a new authentication context.
    var context = new AuthenticationContext(challenge.authorization);
    // Use the context to acquire an authentication token.
    return context.acquireTokenWithClientCredentials(challenge.resource, clientIdx, clientSecretx, function (err, tokenResponse) {
        if (err) {
            throw new Error(err);
        }
        // Calculate the value to be set in the request's Authorization header and resume the call.
        var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
        return callback(null, authorizationValue);
    });
}

  /**
 * AzureKeyVaultWrapper handles authentication of application accessing keyvault
 * @param {string} clientId - clientID of app registered with Azure AD. Also known as application ID
 * @param {string} clientSecret - client secret generated on initial registration of application 
 * @returns  {KeyVaultClient}  - Azure Key Vault Client
 */
exports.AzureKeyVaultWrapper = function(clientId, clientSecret){
    // constructor(clientId, clientSecret) {
        clientIdx = clientId;
        clientSecretx = clientSecret;
        credentials = new KeyVault.KeyVaultCredentials(authenticator);
        return new KeyVault.KeyVaultClient(credentials);
}