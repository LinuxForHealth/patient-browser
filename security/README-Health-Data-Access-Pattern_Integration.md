# How to Securely Deploy Patient Browser Application by integrating with a Health Data Access Pattern FHIR server

## Introduction

Instructions are provided below for a configuration to securely deploy the Patient Browser Application by integrating with a FHIR server protected by a SMART App Launch authorization server that is built on Keycloak, as per the [Health Data Access Reference Implementation](https://github.com/LinuxForHealth/health-patterns/tree/main/data-access).  Note that this is a local deployment end to end - with Patient Browser, IBM FHIR server and Keycloak service each running in separate docker containers. 


## Deployment

### Health Data Access Pattern Deployment

Deploy the Health Data Access Pattern as per [here](https://github.com/LinuxForHealth/health-patterns/tree/main/data-access) but with the following additional steps carried out within the Keycloak Admin Console;

1. Select 'Client' from LHS menu.
2. Click on 'inferno' client from Client pane.
3. If you don't want additional Consent screen after login screen the first time you try to log into Patient Browser, then set 'Consent Required' to 'OFF' for 'inferno' client.
4. Add 'http://127.0.0.1:8081/*' to list of 'Valid Redirect URLs'
5. Add 'http://127.0.0.1:8081' to 'Web Origins' list. 


### Patient Browser Deployment

Git clone this repository and cd into this directory;

```bash
git clone https://github.com/LinuxForHealth/patient-browser
```

Run the following to refresh the build;

```bash
npm i
```

Modify build/config/default.json5 as follows;
1. Set server.url parameter to ‘https://localhost:9443/fhir-server/api/v4'
2. Set authEnabled to ‘true’

Start Patient Browser running on node http server locally by running;

```bash
npm start
```

URL to access Patient Browser deployment is -> http://127.0.0.1:8081

When prompted for username/password enter fhiruser/change-password
