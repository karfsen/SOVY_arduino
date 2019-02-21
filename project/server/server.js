//zadefinovanie ake knižnice používame
const http=require('http');
const express = require('express');
const mysql = require('mysql');
const TokenGenerator = require('uuid-token-generator');



//Definuje token generaciu(pomocou knižnice na tokeny)
const tokgen = new TokenGenerator(128, TokenGenerator.BASE62);
console.log(tokgen);
var app=express();
app.use(express.json());

//Tu je registracia užívateľa , je to viacmenej na 100% hotove

app.post('/register',(req,res,callback)=>{

//callback asynchronnej funkcie
  
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
        con.end();
    callback("New user: "+req.body.name+" Successfully registered!");
  });
});
 
//Toto je funkcia ktoru som vytvoril na vkladanie toho tokenu , pretože som nevedel ako to inak urobiť.proste než sa stihol token vygenerovať tak to prešlo sem a nechcelo to isť.
//Asi to bude trebalo zas nejak cez tú callback funkciu urobiť

function insertToken(token){
  if(token==""){
    console.log("cannot insert nothing!");
  }
  else{
    con.connect((err)=>{
      if(err) throw err;
      console.log("tokenConnected!");
      let sql="INSERT INTO tokens values("+id+",'"+token+"');";
      con.query(sql,(err,res)=>{
        if (err) throw err;
        console.log("Token for user " +name+ " is: " +token);
      });
    });
  }
}

//Login , 70%hotove (ešte tokeny a bude 100%)

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
  let id;
  let name=req.body.name;
  let pw=req.body.password;
  let token="";
    //console.log(req.body.meno);
    //console.log(req.body.pass);
    //console.log(JSON.stringify(data));
    con.connect((err)=>{
      if (err) throw err;      
      console.log("connected");
      let sql="SELECT id,username,password FROM users "+
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
          console.log("User: "+name+" with password: "+pw+" is in database");
          id=res.id;
          token=tokgen.generate();
          console.log(token);
          let obj=new Object();
          obj.username=res[0].username;
          obj.token=token;
          callback(JSON.stringify(obj));
        }
      });
      con.end();
    }); 
});


//request na vyťahovanie dat z databazy , response príde zatiaľ len na request s menom , neskôr po dorobeni token systemu to pôjde cez meno a token

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
      con.end();
  });
});

//Zadefinovanie portu servera.

app.listen(1203,()=>{
    console.log("Sever listening on port 1203");
});
