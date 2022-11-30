const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/getData',function(req, res){
    res.status(200).send({
        success: "true",
        name:"Deez",
        response:"waguan"
    });
})

const PORT = 5111;

app.listen(PORT, ()=>{
    console.log(`server running on port on ${PORT}`);
})