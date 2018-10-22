let chai = require('chai'),
    chaiHttp = require('chai-http'),
    MongoDbConnection = require('../index'),
    {
        MongoClient,
        Db,
    } = require('mongodb'),
    {
        AssertionError
    } = require('assert');


chai.should();
chai.use(chaiHttp);

//Our parent block
describe('MongoDbConnection', () => {

    describe('constructor', () => {
        describe('servers as an object', () => {
            it('should thow a AssertionError if the Uri or servers are not given', async function () {
                const fn = () => new MongoDbConnection(null, 'test');
                fn.should.throw(AssertionError);
            });

            it('should thow a AssertionError if the servers are incomplete', async function () {
                const fn = () => new MongoDbConnection([{
                    host: 'localhost',
                }], 'test');
                fn.should.throw(AssertionError);
            });

            it('should thow a AssertionError if the hosts are given as numbers', async function () {
                const fn = () => new MongoDbConnection([{
                    host: 32324432,
                    port: 27017
                }], 'test');
                fn.should.throw(AssertionError);
            });

            it('should thow a AssertionError if the hosts are given as objects', async function () {
                const fn = () => new MongoDbConnection([{
                    host: {
                        foo: 'fighters'
                    },
                    port: 27017
                }], 'test');
                fn.should.throw(AssertionError);
            });

            it('should accept host, port objects with host being string and port being number', async function () {
                const fn = () => new MongoDbConnection([{
                    host: 'localhost',
                    port: 27017
                }], 'test');
                fn.should.not.throw(AssertionError);
            });
        });

        describe('servers as an uri', () => {
            it('should thow a AssertionError if the Uri is not given', async function () {
                const fn = () => new MongoDbConnection(null, 'test');
                fn.should.throw(AssertionError);
            });

            it('should accept any string', async function () {
                const fn = () => new MongoDbConnection('mongodb://localhost:27017', 'test');
                fn.should.not.throw(AssertionError);
            });
        });

        describe('databaseName parameter', () => {
            it('should thow a AssertionError if the database is not given', async function () {
                const fn = () => new MongoDbConnection([{
                    host: 'localhost',
                    port: 27017
                }], );
                fn.should.throw(AssertionError);
            });

            it('should thow a AssertionError if the database name is given as a number', async function () {
                const fn = () => new MongoDbConnection([{
                    host: 'localhost',
                    port: 27017
                }], 334234);
                fn.should.throw(AssertionError);
            });

            it('should thow a AssertionError if the database name is given as an object', async function () {
                const fn = () => new MongoDbConnection([{
                    host: 'localhost',
                    port: 27017
                }], {
                    foo: 'fighters'
                });
                fn.should.throw(AssertionError);
            });
        })
    });

    describe('connect', () => {
        it('should connect to a database and return an database instance', async function () {
            const mongodb = new MongoDbConnection('mongodb://localhost:27017', 'test');
            mongodb.client.should.be.an.instanceOf(MongoClient);
            const connected_before = await mongodb.client.isConnected();
            connected_before.should.be.false;
            const database = await mongodb.connect();
            database.should.be.an.instanceof(Db);
            const connected_after = await mongodb.client.isConnected();
            connected_after.should.be.true;
        });
    });
});