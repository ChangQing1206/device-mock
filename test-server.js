// mosca 服务端  不使用固定集合
var mosca = require('mosca')

// 设备状态
var deviceState = new Map();

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
  // 第一步
  console.log("mqtt server started");
});
// 服务器处理发布端的事情
server.on('published', function(packet, client) {
  // 第三步
  console.log("服务器接收客户端发布");
  console.log(packet); 
  
  // 充值的消息能发送成功 如何确保充值数据到达了设备
  // 设备会响应充值状态 ，如果一定时间内无回应（不代表充值失败）但很大
  // 概率失败，且在服务器处存储设备状态（仅在服务器存储状态，不能保证数据从服务器到设备的过程），两者结合充分保证充值过程
  
  

  /*
    // 首次的消息
    {
      topic: '$SYS/v_FAWgd/new/clients',
      payload: 'mqttjs_0e967544',
      messageId: 'Co~Hwew',
      qos: undefined,
      retain: undefined
    }
    // 第二次的消息
    {
      topic: 'deposit/increaseDeposit/f10cf977',
      payload: <Buffer 7b 22 6e 61 6d 65 22 3a 22 73 73 22 2c 22 69 64 65 6e 74 69 74 79 22 
    3a 22 34 34 30 38 38 31 31 39 39 39 31 32 30 36 36 37 36 37 22 2c 22 64 65 70 6f ... 9 more bytes>,
      messageId: 'k9vu1jd',
      qos: 0,
      retain: false
    }
    // 
  */
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
  // 第二步
  // 存储设备状态
  var state = 1;
  deviceState.set(client.id, state)
});

server.on("clientDisConnected", function(client) {
  console.log('client disConnected: ' + client.id + ' userNumber: ' + usermap.keys.length);
  var state = 0;
  deviceState.set(client.id, state);
});

