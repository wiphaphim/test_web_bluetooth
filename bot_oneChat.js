// var axios = require('axios');
// var send_message = JSON.stringify({"to":"U8732051cd7e156e3b78719a7155430bc","bot_id":"B06e1ba78784f59e7b7a6f8f0a9fc35ac","type":"text","message":"Hello world again5555!!","custom_notification":"เปิดอ่านข้อความใหม่จากทางเรา"});

// var config = {
//   method: 'post',
//   url: 'https://chat-api.one.th/message/api/v1/push_message',
//   headers: { 
//     'Authorization': 'Bearer Afa48433443b75789b529a8fcef1b4eff295a28438b524eec8ccdb3855a95a311ff240b8d6733489fa86fc17ded6c9719', 
//     'Content-Type': 'application/json'
//   },
//   data : send_message
// };

// axios(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
//   console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
// })
// .catch((error) => {
//   console.log(error);
// });

var axios = require('axios');
var data = JSON.stringify({"to":"U8732051cd7e156e3b78719a7155430bc","bot_id":"B076e3cab5c8b5e26938eb16eddfb56a6","type":"web","url":"https://chatbot-version-demo.herokuapp.com","custom_notification":"เว็บวิวจ้า"});

var config = {
  method: 'post',
  url: "https://chat-api.one.th/message/api/v1/push_message",
  headers: { 
    'Authorization': 'Bearer Afa48433443b75789b529a8fcef1b4eff295a28438b524eec8ccdb3855a95a311ff240b8d6733489fa86fc17ded6c9719', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify("data ===>", response.data));
  // console.log('server encoded the data as: ' + (response.headers['content-encoding'] ))
  console.log(JSON.stringify("Headers ===>", response.headers));
  console.log(JSON.stringify("Headers ===>", response.parameters));

})
.catch(function (error) {
  console.log(error);
});

