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


## MySQL Database Code

1. Creating the database - `Create database dyte`
2. Creating table - `create table webhooks(id char(64), targetUrl varchar(100))`
3. Example of Inserting rows - `insert into webhooks value('d65b2caf-162a-41c1-b37f-a4ffefa10780','https://www.dyte.io/')`
4. Selecting rows - `select * from webhooks`
5. Updating rows - `update webhooks set targetUrl = 'https://www.linkedin.com'`
6. Deleting rows - `delete from webhooks where id = 'd65b2caf-162a-41c1-b37f-a4ffefa10780'` 

id is char(64) because I am using UUIDs which is 64 characters in length

## Dockerfile and docker-compose.yml added.



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
