[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# Author - Rohit Mahesh, 18BCE2172, VIT Vellore

# Dyte Backend using Moleculerjs, Expressjs
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Usage

1. run `npm install` to install all the dependencies.
2. In the `webhooks.service.js` file change the MySQL database parameters in the adapter in the order (`DB_NAME,DB_USERNAME`,`DB_PASSWORD`,`DB_HOST`,`Database used`);   
3.Start the project with `npm run dev` command. 
4. After starting, open the http://localhost:3000/ URL in your browser. 
5. The webhooks can be accessed in the url - http://localhost:3000/api/webhook/


## Services
- **api**: API Gateway services
- **webhooks**: Service with `register`, `list`, `update`, `delete` and `trigger` actions.

## Actions in webhook service
1. Register - When a get request is received in the /register path it inserts a UUID and targetUrl from parameter to the database.
2. List - When a get request is received in the /list path it fetches all the webhook data stored in the database.
3. Update - When a get request is received in the /update path it updates the URL to a new target based on the ID.
4. 4. Delete - When a get request is received in the /delete path it deletes the webhook data based on the ID.
5. Trigger -  When a get request is received in the /ip path it performs a POST request to all webhooks in the database in batches of 10 in parallel. It accepts the Ip address as a parameter.


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose
