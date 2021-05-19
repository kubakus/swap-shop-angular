# UI repository for SwapShop Management Project

## Prerequisites
* Docker [Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
* Docker-compose [Mac/Windows/Linux](https://docs.docker.com/compose/install/)
* Node version ~14.15.4 [Node.js website](https://nodejs.org/en/download/package-manager/#snap) - it is worth to install Node using nvm [tutorial](https://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/)
* Angular CLI [Angular docs](https://angular.io/guide/setup-local)
* yarn [Install guide](https://classic.yarnpkg.com/en/docs/install/#debian-stable)

# Run

1. yarn serv:dc - Create Nginx container to redirect Http calls to db-api
2. yarn serve - Start the UI

Application will be accessible on http://localhost:4300/

For more information about the commands, see package.json file.

