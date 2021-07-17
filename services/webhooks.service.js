"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/*
Importing Libraries.

1. moleculer-db, moleculer-db-adapter-sequelize and sequelize are required to connect to MySQl.
2. uuids (universally unique identifier) were used as the unique id for the table.
3. axios was used to generate POST requests with parameters for convenience.

*/
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const requestIp = require("request-ip");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

axios.defaults.withCredentials = true; // Will prevent any Cors restrictions

/*


*/

module.exports = {
	name: "webhooks",

	// This mixin allows the use of moleculer-db helper methods
	mixins: [DbService],

	//Creating an adapter that will connect to the database
	//The order of parameters are (DB_NAME,DB_USERNAME,DB_PASSWORD,DB_HOST,Database used);
	adapter: new SqlAdapter("dyte", "root", "mysql", {
		host: "localhost",
		dialect: "mysql",
	}),

	// Setting up the database model for sequelize.
	model: {
		name: "webhooks",
		define: {
			uniqueId: Sequelize.STRING,
			targetUrl: Sequelize.STRING,
		},
	},
	/**
	 * Settings. Mentioning the column names
	 */
	settings: { fields: ["uniqueId", "targetUrl"] },
	/**
	 * Actions. This is where all the functionality is.
	   There are 5 actions.

	   1. Register
	   2. list
	   3. Update
	   4. delete
	   5. Trigger
	 */
	actions: {
		/* When a get request is received in the /register path it inserts a UUID and targetUrl
		from parameter to the database.
		*/

		register: {
			rest: {
				method: "GET",
				path: "/register",
			},
			params: {
				targetUrl: "string",
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const id = uuidv4();
				this.adapter.db
					.query(
						`insert into webhooks value( '${id}','${ctx.params.targetUrl}')`
					)
					.then(([res]) => res);

				return id;
			},
		},

		/* When a get request is received in the /list path it fetches all the webhook data stored
		in the database.
		*/

		list: {
			rest: "/list",

			/** @param {Context} ctx  */
			async handler(ctx) {
				return this.adapter.db
					.query("SELECT * FROM webhooks")
					.then(([res]) => res);
			},
		},
		/* When a get request is received in the /update path it updates the URL to a new target
		based on the ID.
		*/

		update: {
			rest: "/update",
			params: {
				id: "string",
				newTargetUrl: "string",
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const result = await this.adapter.db
					.query(
						`update webhooks set targeturl = '${ctx.params.newTargetUrl}' where id = '${ctx.params.id}'`
					)
					.then(([res]) => res);
				if (result.changedRows > 0) {
					return `Changed targetUrl to ${ctx.params.newTargetUrl} Successfully`;
				} else {
					return `Could not find webhook of id ${ctx.params.id}`;
				}
			},
		},

		/* When a get request is received in the /delete path it deletes the webhook data
		 based on the ID*/

		delete: {
			rest: "/delete",
			params: {
				id: "string",
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const result = await this.adapter.db
					.query(`delete from webhooks where id = '${ctx.params.id}'`)
					.then(([res]) => res);
				if (result.affectedRows > 0) {
					return `Deleted Webhook Successfully`;
				} else {
					return `Could not find webhook of id ${ctx.params.id}`;
				}
			},
		},

		/* When a get request is received in the /ip path it sends a POST request with a payload of ipAddress and Unix Timestamp
		to all webhooks in the database in batches of 10 in parallel.
		It accepts the Ip address as a parameter.
		*/

		trigger: {
			rest: "/ip",
			params: {
				ipAddress: "string",
			},

			/** @param {Context} ctx  */
			async handler(ctx) {
				// Fetching allwebhooks from database
				const result = await this.adapter.db
					.query(`select * from webhooks`)
					.then(([res]) => res);

				let promises = []; // array to store promises

				// Checking to see if the request has a parameter
				if (ctx.params.ipAddress) {
					// This loop is used to count run a post request on all URL in database.
					for (let i = 0; i < result.length; i++) {
						/*
						Checks if count of promises is less than 10 and pushes to a list.

						*/
						if (promises.length < 10) {
							promises.push(
								axios
									.create({
										baseURL: `${result[i].targetUrl}`,

										// This function is used to resolve the request only if the status is 200
										validateStatus: function (status) {
											return status == 200;
										},
										maxRedirects: 5, // If the request is not resolved, it will redirect only 5 times at max
									})
									.post("/", {
										ipAddress: ctx.params.ipAddress,
										// Date().getTime() gives Unix time in milliseconds
										// Divide by 1000 to get it in seconds
										timestamp: Math.round(
											new Date().getTime() / 1000
										),
									})
							);
						} /*
						If the count reaches 10 then all promises in the list are resolved before proceeding to other
						requests. This repeats in batches of 10s until all processesa are completed
						 */ else if (promises.length == 10) {
							Promise.all(promises).then(() => {
								console.log("all done");
							});
							promises = []; // setting list back to empty after resolving 10 promises.
						}
					}
				}
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
