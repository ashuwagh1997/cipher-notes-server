const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const url = 'mongodb://localhost:27017';
const dbName = 'cn';
const client = new MongoClient(url, { useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use ( require('cors')());

client.connect(function (err) {

    if (err) return console.log(err);

    console.log("Connected successfully to database server");

    const db = client.db(dbName);

    // R - qp: username
    app.get('/apis/readnotes', function (req, res) {

        console.log(req.query);

        db.collection('notes').find({ 'username': req.query.username }, {}).toArray(function (err, result) {

            if (err) return res.json(err);

            res.json(result);
        });

    });

    //C - qp: username, bp: title, desc
    app.post('/apis/createnote', function (req, res) {

        var doc = {
            
            username :req.query.username,

            title :req.body.title,

            desc : req.body.desc,

            create_at: new Date(),

            updated_at: new Date()
        };

        db.collection('notes').insert( doc, function (err, result) {

            if (err) return res.json(err);

            res.json(result);
        });

    });

    //U - qp: id, bp: { title, desc }
    app.post('/apis/updatenote', function (req, res) {

        var id = req.query.id;

        db.collection('notes').update({ _id: ObjectId(id) }, { $set: { ...req.body, updated_at: new Date() } }, function (err, result) {

            if (err) return res.json(err);

            res.json(result);

        })
    });

    //D - qp: id
    app.post('/apis/deletenote', function (req, res) {

        var id = req.query.id;

        db.collection('notes').remove({ _id: ObjectId(id) }, function (err, result) {

            if (err) return res.json(err);

            res.json(result);

        })
    })

    //D all - qp: username
    app.post('/apis/deleteall', function (req, res) {

        var username = req.query.username;

        db.collection('notes').remove({ username: username }, function (err, result) {

            if (err) return res.json(err);

            res.json(result);

        })
    })

    app.listen(3000);

    // client.close();
});