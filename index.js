var express = require('express');
var app = express();

const redis = require('redis');
const client = redis.createClient();
   
(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Connection Error', err));


//serve static files from the public directory
app.use(express.static('public')); 

//initialize values
client.connect();
client.mSet("header", 0, "left", 0, "article", 0, "right", 0, "footer", 0);
client.mGet(
    ["header", "left", "article", "right", "footer"],
    function (err, value) {
        console.log(value);
    }
);

function data() {
    return new Promise((resolve, reject) => {
        client.mGet(
            ["header", "left", "article", "right", "footer"],
            function (err, value) {
                const data = {
                    header: Number(value[0]),
                    left: Number(value[1]),
                    article: Number(value[2]),
                    right: Number(value[3]),
                    footer: Number(value[4]),
                };
                err ? reject(null) : resolve(data);
            }
        );
    });
}

//get key data
app.get('/data', function (req, res) {
    data().then((data) => {
        console.log(data);
        res.send(data);
    });
});

//plus
app.get("/update/:key/:value", function (req, res) {
    const key = req.params.key;
    let value = Number(req.params.value);
    client.get(key, function (err, reply) {
      // new value
      value = Number(reply) + value;
      client.set(key, value);
  
      // return data to client
      data().then((data) => {
        console.log(data);
        res.send(data);
      });
    });
  });


app.listen(4000, function(){
    console.log("Running on Port 4000");
});

process.on("exit", function() {
    client.quit();
});