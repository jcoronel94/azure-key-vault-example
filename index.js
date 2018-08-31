var clientId = getEnvironmentVariable('CLIENT_ID')
var clientSecret = getEnvironmentVariable('CLIENTSECRET')
var vaultUri = getEnvironmentVariable('KEYVAULT')

var azure = require('azure-storage');
const client = require('./keyvaultwrapper').AzureKeyVaultWrapper(clientId,clientSecret);


//Storage account connection string is hidden in key vault. Query the secret in key azure and instantiate the storage account
var blobService;

client.getSecret(vaultUri, getEnvironmentVariable('STORAGEACCOUNTSECRETNAME'), getEnvironmentVariable('STORAGEACCOUNTSECRETVERSION'), null)
.then((resolve, reject) =>{
    if (reject){ 
        console.log(reject);
    }
    blobService = azure.createBlobService(resolve.value).withFilter(new azure.ExponentialRetryPolicyFilter());
});



function getEnvironmentVariable(name) {
    return process.env[name];
}