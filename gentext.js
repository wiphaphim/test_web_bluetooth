const crypto = require('crypto'),

message = crypto.randomBytes(400).toString('hex');
console.log(message);