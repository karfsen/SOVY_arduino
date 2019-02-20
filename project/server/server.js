const http=require('http');
const express = require('express');
const mysql = require('mysql');
const TokenGenerator = require('uuid-token-generator');
let token;




const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
var app=express();
app.use(express.json());

app.post('/register',(req,res,callback)=>{

  callback=function(value){
    res.status(200).send(value);
  };

const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

    con.connect((err)=>{
      if (err) throw err;      
        console.log("connected");
        let sql = "INSERT INTO users(username,password,arduinoID) "+
        "VALUES ('"+req.body.name+"','"+req.body.password+"','"+req.body.arduinoid+"');";
        console.log(sql);
        con.query(sql,(err,res)=>{
          if (err) throw err;
          console.log("NEW USER! name: "+req.body.name+" password:"+req.body.pass+" arduino id : "+req.body.arduinoid);
    });
    callback("New user: "+req.body.name+" Successfully registered!");
  });
});

app.post('/login',(req,res,callback)=>{
  callback=function(value){
    res.status(200).send(value);
  };

  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

  let data;
  let name=req.body.name;
  let pw=req.body.password;
  let json;
    //console.log(req.body.meno);
    //console.log(req.body.pass);
    //console.log(JSON.stringify(data));
    con.connect((err)=>{
      if (err) throw err;      
      console.log("connected");
      let sql="SELECT username,password FROM users "+
      "WHERE username like '"+name+"' "+
      "and password like '"+pw+"';";
      console.log(sql);
      con.query(sql,(err,res)=>{
        if(err) throw err;
        if(res.length==0){
          console.log("User: "+name+" with password: "+pw+" is not in database");
          callback("Incorrect Username or password!");
        }
        else{
          let obj=new Object();
          console.log("User: "+name+" with password: "+pw+" is in database");
          obj.username=res[0].username;
          obj.password=res[0].password;
          callback(JSON.stringify(obj));
        }
    });
  });
});
app.post('/getsteps',(req,res)=>{
  
  callback=function(value){
    res.status(200).send(value);
  };

  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

  let name=req.body.name;
  con.connect((err)=>{
    if (err) throw err;
      let sql="select time,thisSessionSteps,totalSteps from data "+
      "INNER JOIN users on data.id=users.id "+ 
      "where username like '"+name+"';";

      con.query(sql,(err,res)=>{
        if (err) throw err;
        
        console.log(res);
        callback((res));
      });
  });
});


app.listen(1203,()=>{
    console.log("Sever listening on port 1203");
});
