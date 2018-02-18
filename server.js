
var connect = require('connect');
var serveStatic = require('serve-static');

var WebSocket = require('ws');

// import { Aqueduct } from 'aqueduct';
var BigNumber = require('bignumber.js');
var ZeroEx = require('0x.js');


var Aqueduct = require('aqueduct');
var MarketOrder = Aqueduct.MarketOrder;


connect().use(serveStatic(__dirname)).listen(3000, function(){
  console.log('Server running on 3000...');
});
