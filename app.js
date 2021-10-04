let express = require("express");

const app = express();

const port = 5000;
app.listen(port,function(){
    console.log("listening at port"+port);
})
app.get("/",function(req,res){
    res.send("hello world");
})

app.post("/",function(req,res){
    let body = req.body;
    res.send(body);
})