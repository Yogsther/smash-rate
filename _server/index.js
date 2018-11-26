/**
 * Smash Rate, Server side. 
 * NodeJS, Socket io and mysql
 */

/* Choose a port */
var port = 5923;
/**
 *  Import node modules
 *  - Socket, socket io
 *  - mysql - Database
 *  - sanitize (sqlstring) sanitize sql queries
 *  - md5, encrypt passwords
 *  - fs, file-chooser, browse and load JSON's for items and monsters.
 */
var socket = require("socket.io");
var mysql = require("mysql");
var sanitize = require('sqlstring');
var md5 = require('md5');
var fs = require("fs");

var express = require("express");
var app = express();

const credentials = JSON.parse(fs.readFileSync("credentials.json"));

var con = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  /*   password: "", */
  database: "smash_rate"
});


var server = app.listen(port, function () {

  var io = socket(server);

  console.log("Server started")



  /* END OF SOCKET */
});