const crypto = require('crypto'),

message = crypto.randomBytes(100).toString('hex');
console.log(message);