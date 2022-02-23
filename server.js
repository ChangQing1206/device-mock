// mosca 服务端  不使用固定集合
var mosca = require('mosca')
var MongoClient = require('mongodb').MongoClient;
var dtime = require('time-formater');
var url = 'mongodb://localhost:27017/scene';
var scene;
MongoClient.connect(url, function (err, db) {
	if(err) throw err;
	console.log("mongo数据库已连接");
	scene = db;
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
  console.log("服务器接收客户端发布");
  var topic = packet.topic; // {topic, payload} packet.payload.toString()
  switch(topic) {
    case "vistor/update_vistor_model":
      // 更新游客数据时 插入游客表
      var vistor = {};
      var v = JSON.parse(packet.payload.toString());
      vistor.identity = v.identity;
      vistor.name = v.name;
      vistor.bodyTem = v.bodyTem;
      vistor.position = v.position;
      vistor.date_time = dtime().format('YYYY-MM-DD HH:mm'); // 加上更新时间
      console.log('vistor', vistor);
      try {
        scene.collection("vistors").insertOne(vistor, function(err, res) {
          if(err) throw err;
          console.log("插入成功")
        })
      } catch(err) {
        console.log(err);
      }
      break;
  }

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

