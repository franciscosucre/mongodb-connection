# **mongodb-connection**

MongoDb Implementation that uses the same connection to save some performance. It is intended to be used as a singleton.

**How to install**
----------
```shell
npm install --save mongodb-connection
```

**MongoDbConnection**
----------

Main implementation class. 

**Parameters**:

- **servers:** An array of objetcs with server information (Example: { host: 'localhost', port: 27017}) or the mongodb uri
- **databaseName:** Name of the database to connect.
- **options:** [MongoDB client options](http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html)

**Methods**

- **connect(options):** Verifies if there is not a current connection and creates one if there is not.

**Example - Promise**
----------

```javascript
async function method(){
    await mongodb.connect();
    const collection = mongodb.database.collection('test');
    return await collection.find();
}
```