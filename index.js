const { MongoClient } = require("mongodb"),
  assert = require("assert");

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
    assert(servers != null, `The Uri or the servers are required`);
    assert(
      typeof databaseName === "string",
      `The database name is required and must be a string`
    );
    assert(
      databaseName.trim() != "",
      `The database name cannot be an empty string`
    );
    if (typeof servers === "string") {
      if (
        !(
          servers.startsWith("mongodb://") ||
          servers.startsWith("mongodb+srv://")
        )
      ) {
        servers = "mongodb://" + servers;
      }
      this.url = servers;
    } else {
      this.url = servers.reduce((previous, current, index, array) => {
        assert(
          current.host != null,
          `The host is required for earch server object`
        );
        const host = current.host;
        assert(
          typeof current.host === "string",
          `The given host is not a string. Host:'${current.host}'`
        );
        assert(
          current.port != null,
          `The port is required for earch server object`
        );
        const port = current.port;
        assert(
          typeof current.port === "number",
          `The given port is not a number. Port:'${port}'`
        );
        previous += `${host}:${port}`;
        if (index < array.length - 1) {
          previous += ",";
        }
        return previous;
      }, "mongodb://");
    }
    this.databaseName = databaseName;
    this.options = Object.assign(
      {
        useNewUrlParser: true
      },
      options
    );
    this.client = new MongoClient(this.url, this.options);
    this.database = null;
  }

  /**
   * Verifies if there is not a current connection and creates
   * one if there is not.
   *
   * @async
   * @function connect
   * @returns Promise<Db>
   */
  async connect() {
    if (!this.database || !this.client.isConnected()) {
      await this.client.connect();
    }
    return (this.database = this.client.db(this.databaseName));
  }

  /**
   * Starts a new session on the server. The session can be used to start transactions on
   * replica set servers
   *
   * Options: https://mongodb.github.io/node-mongodb-native/3.1/api/global.html#SessionOptions
   * Transaction Options: https://mongodb.github.io/node-mongodb-native/3.1/api/global.html#TransactionOptions
   *
   * @param {object} [options]
   * @param {boolean} [options.causalConsistency=true] : Whether causal consistency should be enabled on this session
   * @param {object} [options.defaultTransactionOptions]
   * @param {ReadConcern} [options.defaultTransactionOptions.readConcern]
   * @param {WriteConcern} [options.defaultTransactionOptions.writeConcern]
   * @param {ReadPreference} [options.defaultTransactionOptions.readPreference]
   */
  startSession(options) {
    return this.client.startSession(options);
  }
}

module.exports = MongoDbConnection;
