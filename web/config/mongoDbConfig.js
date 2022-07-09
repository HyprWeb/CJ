const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://mongodb", 
{   useNewUrlParser: true, useUnifiedTopology: true },
    function (err, client) {
        if (err) throw err;
        const db = client.db("hyprDB");
        global.db = db;
    }
);
