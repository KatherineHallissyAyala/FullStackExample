const redis = require('redis');
const client = redis.createClient();
   
(async () => {
    await client.connect();
})();

//client.on('connect', () => console.log('Redis Client Connected'));
//client.on('error', (err) => console.log('Redis Client Connection Error', err));

//single value write & read
client.set("my_key", "Hello World!");
client.get("my_key", function(err, reply){
    console.log(reply);
});

//multiple value write & read
client.mSet('header', 0, 'left', 0, 'right', 0, 'footer', 0);
client.mGet(['header', 'left', 'article', 'right', 'footer'],
    function(err, value){
        console.log(value);
    });

client.quit();