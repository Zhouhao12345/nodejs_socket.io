var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require('./config');
var redis = require('redis');
    RDS_PORT = config.redis_port,
    RDS_HOST = config.redis_host,
    RDS_OPTS = config.redis_opts,

server.listen(config.socket_port);
io.on('connection', function (socket) {

    console.log("new client connected");
    var redisClient = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
    redisClient.subscribe('message');

    redisClient.on("message", function(channel, message) {
        console.log("mew message in queue "+ message + "channel");
        socket.emit(channel, message);
    });

    socket.on('disconnect', function() {
        redisClient.quit();
    });

});
