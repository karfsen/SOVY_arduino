const http=require('http');
const express = require('express');
const mysql = require('mysql');
const TokenGenerator = require('uuid-token-generator');
const screen=require('screen');
let token;


var con = mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
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
      if (err) {
        console.log(err+"   at line 29"); 
        res.status(500).send(err);
      }
      else{
        console.log("connected");
        let sql = "INSERT INTO `users`(`username`,`password`, `arduinoID`) VALUES ('"+req.body.name+"','"+req.body.pass+"','"+req.body.arduinoid+"')";
        con.query(sql,(err)=>{
        if (err) {
          res.status(400).send(err);
          console.log(err+"   at line 37");
        }
        else{
          console.log("NEW USER! name:"+req.body.name+"password"+req.body.pass+"arduino id :"+req.body.arduinoid);
          res.status(201).send("Successfully registered!");
          }
        });
      }
    });
});

app.post('/login',(req,res)=>{
  let data;
  let name=req.body.name;
  let pw=req.body.pass;
    //console.log(req.body.meno);
    //console.log(req.body.pass);
    //console.log(JSON.stringify(data));
  con.connect((err)=>{
    if (err){
    console.log(err+"at line 58");
    res.status(500).send();
    }
    else{
      con.query("SELECT * FROM users",(err,result)=>{
        data=result;
      if (err) {
        console.log(err+"at line 64");
        res.status(500).send();
      }
      else{
        for(let i=0;i<result.length;i++){
          if((name===data[i].name)&&(pw===data[i].password)){
            console.log(data[i].name,data[i].password);
            res.status(200).send("Logged in!");
          }
          else{
            console.log("Wrong username or pw");
            res.status(401).send("Wrong username or password!");
          }
        }
      }
    });  
  }  
    
    /*for(i=0;i<data.length;i++){
      if((name==data.name[i])&&(pw==data.pass[i])){
          token=tokgen.generate();
          res.status(200).send(JSON.stringify(name,token));
      }
    }  */
  });
});

app.post('/getsteps',(req,res)=>{
  let name=req.body.name;
  con.connect((err)=>{
    if (err){ 
      console.log(err+"at line 92");
      res.status(500).send();
    }
    else{
      id=con.query("select id from users where username like '"+name+"';");
      con.query("SELECT * FROM data where id like "+id+";",(err,result)=>{
        if (err){ 
          console.log(err+"at line 97");
          res.status(401).send();
        }
          
        else{
          for(let i=0;i<result.length;i++){
            console.log(result);
            res.status(200).send(result);
          }
        }
      });
    } 
  });
});


app.listen(1203,()=>{
    console.log("Sever listening on port 1203");
});
