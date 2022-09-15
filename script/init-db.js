const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const config = require('../config/default.json');
require('dotenv').config({ path: '../.env' })
const dataFiles = [
    {
        path: config.data.accounts.source,
        collection: 'accounts',
        status: 'notAvailable'
    },
    {
        path: config.data.accounts.largeSource,
        collection: 'accounts-large',
        status: 'notAvailable'
    },
    {
        path: config.data.transactions.source,
        collection: 'transactions',
        status: 'notAvailable'
    },
    {
        path: config.data.transactions.largeSource,
        collection: 'transactions-large',
        status: 'notAvailable'
    }
];
const insertFile = async function(file, lednDb) {
    try {
        const data = fs.readFileSync(file.path);
        const docs = JSON.parse(data.toString());
        await lednDb.createCollection(file.collection)
        const res = await lednDb.collection(file.collection).insertMany(docs);
        console.log(`Inserted docs to ${file.collection}:`, res.insertedCount);
    } catch (err) {
        console.log(err);
    }
}
const getCollections = async function(lednDb) {
    try {
        const collections = await lednDb.listCollections().toArray();
        return collections.map(collection => collection.name);
    } catch (err){
        console.log(err);
    }
}
const validateDb = async function() {
    try {
        const connectionString =  `mongodb://${process.env[config.mongoDb.dbUserName]}:${process.env[config.mongoDb.dbPassword]}@${config.mongoDb.hostname}:${config.mongoDb.port}/${config.mongoDb.dbName}`
        let mongoClient = new MongoClient(connectionString, { useUnifiedTopology:true });
        await mongoClient.connect();
        const lednDb = mongoClient.db(config.mongoDb.dbName);
        const dbCollections = await getCollections(lednDb);
        for (fileIndex in dataFiles) {
            dataFiles[fileIndex].status = dbCollections.includes(dataFiles[fileIndex].collection) ? 'available' : 'notAvailable';
        }
        await Promise.all(dataFiles.map(async (file) => {
                if (file.status === 'notAvailable') {
                    await insertFile(file, lednDb);
                } else {
                    console.log(`Collection ${file.collection} already exists!`);
                }
        }));
        await mongoClient.close();
    } catch (err) {
        console.log(err);
    }
}
validateDb();
