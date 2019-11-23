const csv=require('csvtojson');
var formidable = require('formidable');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://dbUser:TJ4lac6I6X9ucQ3I@feedbacksystem-bu2f1.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
const collection = client.db("test").collection("devices");
// perform actions on the collection object
console.log('database connected');
client.close();
});

