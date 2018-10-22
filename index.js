const {
    MongoClient,
    MongoError
} = require('mongodb'),
    assert = require('assert');

/**
 * MongoDb Implementation that uses the same connection to save some performance.
 * 
 * It is intended to be used as a singleton.
 *
 * @class MongoDbConnection
 */
class MongoDbConnection {
    /**
     * Creates an instance of MongoLeroyDriver.
     * @param {String|Object[]} servers An array of objetcs with server information or the mongodb uri
     * @param {String} servers[].host
     * @param {Number} servers[].port
     * @param {String} databaseName Name of the database to connect.
     * @param {Object} [options] MongoDB client options http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
     * @param {Boolean} [options.useNewUrlParser=true] Should be placed as true to avoid deprecated warnings
     * @param {String} [options.authSource] The database that holds the authentication information
     * @param {Object} [options.auth] Authentication information
     * @param {Object} [options.auth.user] MongoDB username
     * @param {Object} [options.auth.password] MongoDB password
     * @param {String} [options.replicaSet] The name of the replica set to which we are connecting
     * @memberof MongoLeroyDriver
     */
    constructor(servers, databaseName, options) {
        if (typeof servers === 'string') {
            this.url = servers;
        } else {
            this.url = servers.reduce((previous, current, index, array) => {
                const host = current.host != null && current.host.trim() != '' ? current.host : 'localhost';
                const port = current.port || 27017;
                assert(!isNaN(port), new MongoError(`The given port is not a number. Port:'${port}'`));
                previous += `${host}:${port}`;
                if (index < array.length - 1) {
                    previous += ','
                }
                return previous;
            }, 'mongodb://')
        }
        assert(databaseName != null & databaseName.trim() != '', new MongoError(`The database name is required`));
        this.databaseName = databaseName;
        this.options = Object.assign({
            useNewUrlParser: true
        }, options);
        this.client = new MongoClient(this.url, options);
        this.database = null;
    }

    /**
     * Verifies if there is not a current connection and creates
     * one if there is not.
     * 
     * @returns 
     */
    async connect() {
        if (!this.database || !this.client.isConnected()) {
            await this.client.connect()
        }
        return this.database = this.client.db(this.databaseName);
    }
}


module.exports = MongoDbConnection;