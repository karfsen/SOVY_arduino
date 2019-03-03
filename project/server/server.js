//zadefinovanie ake knižnice používame
const http=require('http');
const express = require('express');
const mysql = require('mysql');
const TokenGenerator = require('uuid-token-generator');
const cors=require('cors');


//Definuje token generaciu(pomocou knižnice na tokeny)
const tokgen = new TokenGenerator(128, TokenGenerator.BASE62);
console.log(tokgen);
var app=express();
app.use(express.json());
app.use(cors());

//Tu je registracia užívateľa , je to viacmenej na 100% hotove

app.post('/register',(req,res,callback)=>{
let end=0;
//callback asynchronnej funkcie
  callbackEnd=function(value){
    if(value==1)
    con.end();
    console.log("ended connection!");
  };

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
        "VALUES ('"+req.body.username+"','"+req.body.password+"','"+req.body.arduinoid+"');";
        console.log(sql);
        con.query(sql,(err,res)=>{
          if (err) console.log(err);
          con.query("SELECT id FROM users WHERE username like '"+req.body.username+"';",(err,res)=>{
            if(err) throw err;
            if(res.length==""){
              return;
            }
            else{
            console.log("NEW USER! name: "+req.body.username+" password:"+req.body.password+" arduino id : "+req.body.arduinoid);
            console.log("vybral som si ID NOVEHO USERA");
            con.query("INSERT INTO tokens VALUES("+res[0].id+",'');",(err)=>{
              if(err) throw err;  
              console.log("VLOZIL SOM ID USERA DO TABULY TOKENS");
              end=1;
              callbackEnd(end);
              });
            }
          });
          callback("New user: "+req.body.username+" Successfully registered!"); 
        });
  });
});
 
/*Toto je funkcia ktoru som vytvoril na vkladanie toho tokenu , pretože som nevedel ako to inak urobiť.proste než sa stihol token vygenerovať tak to prešlo sem a nechcelo to isť.
Asi to bude trebalo zas nejak cez tú callback funkciu urobiť

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
}*/

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

  let name=req.body.username;
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
          console.log(res);
          let id=res[0].id;
          console.log(id);
          token=tokgen.generate();
          console.log(token);
          let obj=new Object();
          obj.username=res[0].username;
          obj.token=token;
          let tokenSQL="UPDATE tokens set token='"+token+"' WHERE id="+id+";"
          console.log(tokenSQL);
          con.query(tokenSQL,(err)=>{
            if(err) throw err;
          });
          callback(JSON.stringify(obj));
        }
      });
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

  let name=req.body.username;
  let token=req.body.token;
  con.connect((err)=>{
    if (err) throw err;
      let sql="select time,thisSessionSteps,totalSteps from data "+
      "INNER JOIN tokens on data.id=tokens.id "+ 
      "INNER JOIN users on data.id=users.id "+
      "where users.username like '"+name+"' and "+
      "tokens.token like '"+token+"';";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        console.log(res);

        if(res.length==0){
          callback("Wrong user/token/not existing user");
        }
        else{
          data=res;
          callback(data);
        }
      });
      con.end();
  });
});

app.post("/sendsteps",(req,res)=>{


  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

let arduinoid=req.arduinoid;
let sessionSteps=req.sessionSteps;

  con.connect((err)=>{
    if (err) throw err;
    let sql="select id from users where arduinoid like '"+arduinoid+"';";
    con.query(sql,(err,res)=>{
      if(err) throw err;
      if(res.length==0){
        console.log("user with this arduinoid doesnt exists");
      }
      else{
        let id=res[0].id;
        let insertSQL="INSERT INTO data(id,thisSessionSteps,totalSteps)"+
        " VALUES("+id+","+sessionSteps+",@steps);";
        con.query(sql,(err)=>{
          if(err) throw err;
          console.log("I have inserted data to database!");
        });
      }
    });
  });
});

//Zadefinovanie portu servera.

app.listen(1203,()=>{
    console.log("Sever listening on port 1203");
});
