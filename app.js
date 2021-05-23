
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));

app.set("view engine", "ejs");


app.get("/", function(req, res) {
    
    const options = {
        "method": "GET",
        "hostname": "covid-19-data.p.rapidapi.com",
        "port": null,
        "path": "/totals",
        "headers": {
            "x-rapidapi-key": process.env.API_KEY,
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
            "useQueryString": true
        }
    };

    const request = https.request(options, function(response) {
        const chunks = [];

        response.on("data", (chunk)=>{
            chunks.push(chunk);
        });

        response.on("end", ()=>{
            const jsonData = JSON.parse(chunks);
            
            res.render("home", { data: jsonData[0] });
        })
        
    })

    request.end();
});

app.post("/country", function(req, res) {

    const countryName = req.body.countryName;

    const options = {
        "method": "GET",
        "hostname": "covid-19-data.p.rapidapi.com",
        "path": `/country?name=${countryName}`,
        "headers": {
            "x-rapidapi-key": process.env.API_KEY,
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
            "useQueryString": true
        }
    };


    const request = https.request(options, (response)=>{
        const chunks = [];

        response.on("data", function(chunk){
            chunks.push(chunk);
        });

        response.on("end", ()=>{
            const jsonData = JSON.parse(chunks);
            // console.log(jsonData);
            res.render("country", { data: jsonData[0] })
        })
    })

    request.end()

})




let port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Server is running on port " + port);
});
