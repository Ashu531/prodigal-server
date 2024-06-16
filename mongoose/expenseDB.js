let {MongoClient} = require('mongodb');
    
const {MONGOURI} = require('../keys')

const client = new MongoClient(MONGOURI);

const database = client.db("expense");

module.exports = database