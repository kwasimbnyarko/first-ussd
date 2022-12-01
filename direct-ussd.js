const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let sessionTracker = new Map();
let userState;
let userStateReason;

const option_1 = "Happy";
const option_2 = "Sad";
const option_3 = "okay"

const option_a = "family";
const option_b = "money";
const option_c = "haha"

// let messageList = [ `Welcome to the base ;)\nThis is USSDTEST's USSD.\nHow are you feeling?\n1. ${option_1}\n2. ${option_2}\n3. ${option_3}`,
//     `Why are you ${userState}?\n Is it because of\n1. ${option_a}\n2. ${option_b}\n3. ${option_c}`,
//     `You are ${userState} because of ${userStateReason}`];

function firstChoice (choice){
    switch (choice) {
        case "1":
            userState = option_1.toLowerCase();
            break;
        case "2":
            userState = option_2.toLowerCase();
            break;
        case '3':
            userState = option_3.toLowerCase();
            break;
    }
    console.log(`choice 1 = ${userState}`);

}

function secondChoice (choice)
{
    switch (choice) {
        case "1":
            userStateReason = option_a.toLowerCase();
            break;
        case "2":
            userStateReason = option_b.toLowerCase();
            break;
        case "3":
            userStateReason = option_c.toLowerCase();
            break;
    }

    console.log(`choice 2 = ${userStateReason}`);
}
app.post('*',function(req, res){
    console.log(req.body);

    let message;
    let msisdn = req.body["MSISDN"];
    let user_id = req.body["USERID"];
    let message_type;
    let session_id = req.body["SESSIONID"];
    let user_data = req.body["USERDATA"];
    console.log(`list before ${Object.fromEntries(sessionTracker)}`);
    let page_number = sessionTracker.get(user_data);
    console.log(`list after ${Object.fromEntries(sessionTracker)}`);



    if(req.body["MSGTYPE"] === true){

        if (user_data.length > 9){
            let direct_code = user_data.slice(9,user_data.length);
            console.log(direct_code);
            for (let i =  0;i < direct_code.length; i++){
                if(direct_code[i]==="*"){
                    console.log("here");
                    continue;
                }else{
                    if(page_number===undefined){
                        console.log(`first run pn: ${page_number}`);
                        firstChoice(direct_code[i]);
                        page_number = 1;
                        console.log(`pn increased to ${page_number}`);
                        sessionTracker.set(session_id,page_number);

                    }else if(page_number===1){
                        secondChoice(direct_code[i]);
                        console.log(`second run pn: ${page_number}`);
                        page_number+=1;
                        console.log(`pn increased to ${page_number}`);
                        sessionTracker.set(session_id,page_number);
                    }
                }
            }
            message_type = page_number !== 2;
            console.log("MT:" + message_type);
            switch(page_number){
                case 1:
                    message = `Why are you ${userState}?\n Is it because of\n1. ${option_a}\n2. ${option_b}\n3. ${option_c}`;
                    break;
                case 2:
                    message = `You are ${userState} because of ${userStateReason}`;
                    break;
            }
            console.log("MN:" + page_number);

        }else{

            message = `Welcome to the base ;)\nThis is USSDTEST's USSD.\nHow are you feeling?\n1. ${option_1}\n2. ${option_2}\n3. ${option_3}`;
            message_type = true;
            console.log(`Old page number first ${page_number}`);
            page_number = 1;
            console.log(`New page number first ${page_number}`);
            sessionTracker.set(session_id,page_number);
        }

    }else if(page_number === 1){
        console.log("hola");

        firstChoice(user_data);
        message = `Why are you ${userState}?\n Is it because of\n1. ${option_a}\n2. ${option_b}\n3. ${option_c}`;
        message_type = true;
        console.log(`Old page number ${page_number}`);
        page_number += 1;
        console.log(`New page number ${page_number}`);
        sessionTracker.set(session_id,page_number);

    }else if(page_number === 2){
        console.log("amigo");

        secondChoice(user_data);
        message = `You are ${userState} because of ${userStateReason}`;
        message_type = false;
        console.log(`Old page number ${page_number}`);
        page_number += 1;
        console.log(`New page number ${page_number}`);
        sessionTracker.set(session_id,page_number);
    }

    console.log({
        "USERID":user_id,
        "MSISDN":msisdn,
        "MSG":message,
        "MSGTYPE":message_type
    })

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