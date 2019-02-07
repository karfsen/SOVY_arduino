const http=require('http');
const express = require('express');
const mysql = require('mysql');
const TokenGenerator = require('uuid-token-generator');
let token;


var con = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "",
     database: "arduinodb"
});

const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);

var app=express();
app.use(express.json());

app.post('/register',(req,res)=>{
    //console.log(req.body);
    //console.log(req.body.name);
    // console.log(req.body.pass);
    // console.log(req.body.arduinoID);

    con.connect((err)=>{
      if (err) throw err;
      console.log("connected");
      let sql = "INSERT INTO `users`(`name`,`password`, `arduinoID`) VALUES ('"+req.body.name+"','"+req.body.pass+"','"+req.body.arduinoid+"')";
      con.query(sql,(err,result)=>{
      if (err) {
      res.status(400).send();
      throw err;
      }
      else{
      console.log("insert done");
      res.status(200).send("Successfully registered!");
      }
      });
  });
});

app.post('/login',(req,res)=>{
  let data;
  let name=req.body.name;
  let pw=req.body.pass;
    //console.log(req.body.meno);
    //console.log(req.body.pass);
    //console.log(JSON.stringify(data));
  con.connect((err)=>{if (err) throw err;
      con.query("SELECT * FROM users",(err,result)=>{
      if (err) throw err;
      console.log(result);
      data=result;
    });   
    
    /*for(i=0;i<data.length;i++){
      if((name==data.name[i])&&(pw==data.pass[i])){
          token=tokgen.generate();
          res.status(200).send(JSON.stringify(name,token));
      }
    }  */
  });
});

app.listen(1203,()=>{
    console.log("Sever listening on port 1203");
});


app.post('/getsteps',(req,res)=>{
  let name=req.body.name
});