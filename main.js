const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/getData',function(req, res){
    console.log(req.body["test"]);
    res.status(200).send({
        success: "true",
        name:"Deez",
        "response":req.body["test"]
    });

})

const PORT = 5111;

app.listen(PORT, ()=>{
    console.log(`server running on port on ${PORT}`);
})