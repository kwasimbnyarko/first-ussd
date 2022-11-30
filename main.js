const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let sessionTracker = new Map();
let userState;
let userStateReason;

const option_1 = "Haappy";
const option_2 = "Sad";
const option_3 = "den things"

const option_a = "family";
const option_b = "money";
const option_c = "haha"

app.post('/getData',function(req, res){
    console.log(req.body);

    let message;
    let msisdn = req.body["MSISDN"];
    let user_id = req.body["USERID"];
    let message_type;
    let session_id = req.body["SESSIONID"];
    let user_data = req.body["USERDATA"];


    if(req.body["MSGTYPE"] === true){
        sessionTracker.set(req.body["SESSIONID"],1);
        message = `Welcome to the base ;)\nThis is USSDTEST's USSD.\nHow are you feeling?\n1. ${option_1}\n2. ${option_2}\n3. ${option_3}`;
        message_type = true;

    }else if(sessionTracker.get(session_id) === 1){
        sessionTracker.set(session_id,2);
        switch (user_data) {
            case 1:
                userState = option_1.toLowerCase();
                break;
            case 2:
                userState = option_2.toLowerCase();
                break;
            case 3:
                userState = option_3.toLowerCase();
                break;
        }
        message = `Why are you ${userState}? Is it because of\n1. ${option_a}\n2. ${option_b}\n3. ${option_c}`;
        message_type = true;
    }else if(sessionTracker.get(session_id) === 2){
        switch (user_data) {
            case 1:
                userStateReason = option_a.toLowerCase();
                break;
            case 2:
                userStateReason = option_b.toLowerCase();
                break;
            case 3:
                userStateReason = option_c.toLowerCase();
                break;
        }
        message = `You are ${userState} because of ${userStateReason}`;
        message_type = false;
    }


    res.status(200).send({
        "USERID":user_id,
        "MSISDN":msisdn,
        "MSG":message,
        "MSGTYPE":message_type
    });
})




const PORT = 5111;

app.listen(PORT, ()=>{
    console.log(`server running on port on ${PORT}`);
})