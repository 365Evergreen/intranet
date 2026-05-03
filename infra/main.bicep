@description('The Azure region for all resources.')
param location string = resourceGroup().location

@description('The name of the Static Web App resource.')
param staticWebAppName string

@description('The name of the storage account.')
param storageAccountName string

@description('The principal display name for the Entra app registration placeholder.')
param appDisplayName string = '365evergreen-intranet'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  name: 'default'
  parent: storageAccount
}

resource intranetContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  name: 'intranet-content'
  parent: blobService
  properties: {
    publicAccess: 'None'
  }
}

resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2023-05-01' = {
  name: 'default'
  parent: storageAccount
}

resource navigationTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-05-01' = {
  name: 'NavigationConfig'
  parent: tableService
}

resource preferencesTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-05-01' = {
  name: 'UserPreferences'
  parent: tableService
}

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    repositoryUrl: 'https://github.com/365Evergreen/intranet'
    branch: 'main'
    stagingEnvironmentPolicy: 'Enabled'
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Enabled'
  }
}

output staticWebAppDefaultHostname string = staticWebApp.properties.defaultHostname
output storageAccountId string = storageAccount.id
output appRegistrationNote string = 'Create an Entra app registration named ${appDisplayName} and configure SWA auth redirect URIs after deployment.'
