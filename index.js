express = module.exports = require('express');
request = module.exports = require('request');
const http = require('http')
const path = require('path')
var mongod = require('mongodb');
const SERVER_PORT = process.env.PORT || 3000;
	//server start configuration here.
app = module.exports = express();

var secureServer = require('http').createServer(app);

urlHanlder 	 = module.exports = require('./classes/urlHandler.class.js');
urlHanlder.BindWithCluster();
databaseClass = module.exports = require("./classes/database.class.js");

	//mongod db connection starting here.
MongoClient = mongod.MongoClient;
MongoID = module.exports = mongod.ObjectID; //reporting conversion class instavle to global for convert string to object
databaseClass.ConnectDatabase(function(){
});

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(SERVER_PORT, () => console.log(`Listening on ${ SERVER_PORT }`))	 
//
secureServer.listen(SERVER_PORT,function(){
    console.log("Server lisen on "+SERVER_PORT);
});

