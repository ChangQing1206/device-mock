// mosca 服务端  不使用固定集合
var mosca = require('mosca')
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var test;
MongoClient.connect(url, function (err, db) {
	if(err) throw err;
	console.log("mongo数据库已连接");
	test = db;
})

// 实例化服务器
var server = new mosca.Server({
  http: {
    port: 3010,
    bundle: true,
    static: './'
  }
});

// 服务器启动
server.on('ready', function() {
  console.log("mqtt server started");
});
// 服务器处理发布端的事情
server.on('published', function(packet, client) {
  var data = JSON.stringify(packet.payload.toString())// {clientId: , topic: }
  console.log("服务器接收客户端发布");
  console.log("Published: ", data);
  var topic = data.topic;
  switch(topic) {
    case "create_vistor_model":
      // 插入数据库

      break;
    case "update_vistor_model":
      // 插入数据库

      break;
  }
  // try {
  //   data = JSON.parse(data);
  //   if(data.name) {
  //   // 插入数据库
  //   test.collection("mos_test").insertOne(data, function (err, res) {
  //     if(err) throw err;
  //     console.log("插入成功");
  //   })
  // }
  // }catch(err) {
  //   console.log("这不是主要内容")
  // }

});
// 服务器处理订阅端的事情
server.on("subscribed", function(topic, client) {
  console.log("服务端接收客户端订阅");
  console.log("subscribed: ", topic);
});

server.on("unSubscribed", function(topic, client) {
  console.log('unSubscribed', topic);
});

server.on("clientConnected", function(client) {
  console.log('client connect: ', client.id);
});

server.on("clientDisConnected", function(client) {
  console.log('client disConnected: ' + client.id + ' userNumber: ' + usermap.keys.length);
});

