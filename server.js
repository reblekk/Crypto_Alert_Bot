const express = require('express');
const server = express();

server.get('/',function(req,res) {
  res.send('find this bot @ https://t.me/pingtingbot');
});

function keepAlive(){
    server.listen(3000, ()=>{console.log("sever ready!")});
}

module.exports = keepAlive;
