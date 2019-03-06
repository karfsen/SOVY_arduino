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

  callback=function(status,value){
    res.status(status).send(value);
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
          if (err){
            console.log(err);
            callback(403,"This arduino is taken!");
          }
          else{
          con.query("SELECT id FROM users WHERE username like '"+req.body.username+"';",(err,res)=>{
            if(err) throw err;
            if(res.length==""){
              callback(401,"Error"); 
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
              callback(200,"New user: "+req.body.username+" Successfully registered!"); 
            }
          });
        }
      });
  });
});

//posielame JSON username password ak je spravny returnne JSON s username a token

app.post('/login',(req,res,callback)=>{
  
  callback=function(status,value){
    res.status(status).send(value);
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
          callback(401,"Incorrect Username or password!");
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
          callback(200,JSON.stringify(obj));
        }
      });
    }); 
  });

//posielame json v ktorom je username a token , ak je spravny nereturnne nič iba 200 kod a hlašku logged off

  app.post('/logout',(req,res,callback)=>{
  
    callback=function(status,value){
      res.status(status).send(value);
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
      //console.log(req.body.meno);
      //console.log(req.body.pass);
      //console.log(JSON.stringify(data));
  
      con.connect((err)=>{
        
        if (err) throw err;      
        console.log("connected");
        
        let sql="SELECT users.id,users.username FROM users "+
        "INNER JOIN tokens on users.id=tokens.id "+
        "WHERE users.username like '"+name+"' "+
        "and tokens.token like '"+token+"';";
        console.log(sql);
  
        con.query(sql,(err,res)=>{
          if(err) throw err;
         
          if(res.length==0){
            console.log("User: "+name+" with token: "+token+" is not logged in");
            callback(401,"User not existing or not logged in");
          }
          else{
            console.log("User: "+name+" with token: "+token+" is logged");
            //console.log(res);
            let id=res[0].id;
            console.log(id);
            let tokenSQL="UPDATE tokens set token='' WHERE id="+id+";"
            console.log(tokenSQL);
            con.query(tokenSQL,(err)=>{
              if(err) throw err;
            });
            callback(200,JSON.stringify("Successfully logged off!"));
          }
        });
      }); 
    });

//request na ktory posielame JSON NAPR{"username":"xxx","token":"dafds664fd5s67f8sdf"} vrati sa počet dnešných krokov prihlaseneho usera

app.post('/todaysteps',(req,res)=>{
  
  callback=function(status,value){
    res.status(status).send(value);
  };

  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
console.log(date);
if(date<10){
  date="0"+date;
  console.log(date);
}

  let name=req.body.username;
  let token=req.body.token;
  con.connect((err)=>{
    if (err) throw err;
      let sql="select time,thisSessionSteps,totalSteps from data "+
      "INNER JOIN users "+ 
      "INNER JOIN tokens on data.id=users.id=tokens.id "+
      "where users.username like '"+name+"' and "+
      "tokens.token like '"+token+"' and "+
      "time >= '2019-03-"+date+"%';";
      console.log(sql);
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        console.log(res);

        if(res.length==0){
          callback(403,"User doesnt have steps in last day/Wrong token :"+data);
        }
        else{
          data=res;
          callback(200,data);
        }
      });
      con.end();
  });
});

//request v ktorom neposielame nič , prijmeme JSON v ktorom je meno a počet krokov každeho usera  počas aktuálneho dňa 

app.post('/alltodaysteps',(req,res)=>{
  
  callback=function(status,value){
    res.status(status).send(value);
  };

  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
console.log(date);
if(date<10){
  date="0"+date;
  console.log(date);
}

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select username,sum(thisSessionSteps) as todaysteps from data "+
      "INNER JOIN users on data.id=users.id "+
      "where time >= '2019-03-"+date+"%' group by username;";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        callback(200,data);  
      });
      con.end();
  });
});

//request na ktory neposielame nič , prijmame JSON kde je sumary číslo spočítaných krokov počas dnešného dňa(všetkých userov)

app.post('/getsteps',(req,res)=>{
  
  callback=function(status,value){
    res.status(status).send(value);
  };

  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
console.log(date);
if(date<10){
  date="0"+date;
  console.log(date);
}

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select sum(thisSessionSteps) as sumary from data "+
      "where time >= '2019-03-"+date+"%';";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        console.log(res);
        callback(200,data);  
      });
      con.end();
  });
});

//neposielame nič , naspäť príde JSON všetkych userov čo niečo niekedy prešli a ich celkovy počet krokov

app.post('/alltimeuserssteps',(req,res)=>{
  
  callback=function(status,value){
    res.status(status).send(value);
  };

  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
console.log(date);
if(date<10){
  date="0"+date;
  console.log(date);
}

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select users.username,sum(thisSessionSteps) as sum from data "+
      "INNER JOIN users on data.id=users.id group by users.username;";

  
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        console.log(res);
        callback(200,data);  
      });
      con.end();
  });
});

//neposielame nič , naspäť príde JSON s počtom minút koľko dnes nachodili všetci useri

app.post('/gettodayminutes',(req,res)=>{
  let pocet=0;
  callback=function(status,value){
    res.status(status).send(value);
  };

  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
console.log(date);
if(date<10){
  date="0"+date;
  console.log(date);
}

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select * from data where time >='2019-03-"+date+"%';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){  
        callback(403,"No one has been doing steps today");
        }
        else{
        for(let i=0;i<res.length;i++){
          if(res[i].thisSessionSteps>0){
            pocet++;
          }
        }
        let obj=new Object();
        obj.minutes=pocet*5;
        callback(200,JSON.stringify(obj));  
      }
    });
    con.end();
  });
});

//posielame JSON obsahujuci username a token vracia JSON počtu minut jedneho usera za jeden den

app.post('/getusertodayminutes',(req,res)=>{
  let pocet=0;
  callback=function(status,value){
    res.status(status).send(value);
  };

  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
console.log(date);
if(date<10){
  date="0"+date;
  console.log(date);
}
  let name=req.body.username;
  let token=req.body.token;
  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select thisSessionSteps from data "+ 
      "INNER JOIN users "+
      "INNER JOIN tokens on data.id=users.id=tokens.id "+
      "where users.username like '"+name+"' and "+
      "tokens.token like '"+token+"' and "+
      "time >='2019-03-"+date+"%';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);

        if(res.length==0){
          callback(403,"No one has been doing steps today"); 
        }
        else{
          for(let i=0;i<res.length;i++){
            if(res[i].thisSessionSteps>0){
              pocet++;
            }
          }
          let obj=new Object();
          obj.minutes=pocet*5;
          callback(200,JSON.stringify(obj)); 
        }
      });
      con.end();
  });
});

//returnne JSON celkoveho počtu minut ktory všetci spolu nachodili

app.post('/getalltimeminutes',(req,res)=>{
  let pocet=0;
  callback=function(status,value){
    res.status(status).send(value);
  };

  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
console.log(date);
if(date<10){
  date="0"+date;
  console.log(date);
}

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select * from data;"
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
          callback(403,"No one has been doing steps today");
        }
        else{
          for(let i=0;i<res.length;i++){
            if(res[i].thisSessionSteps>0){
              pocet++;
            }
          }
          let obj=new Object();
          obj.minutes=pocet*5;
          callback(200,JSON.stringify(obj));  
        }
      });
      con.end();
  });
});

//returnne JSON celkoveho počtu minut ktore user nachodil

app.post('/getuseralltimeminutes',(req,res)=>{
  let name=req.body.username;
  let token=req.body.token;
  let pocet=0;
  callback=function(status,value){
    res.status(status).send(value);
  };

  const con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
console.log(date);
if(date<10){
  date="0"+date;
  console.log(date);
}

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select * from data "+ 
      "INNER JOIN users "+
      "INNER JOIN tokens on data.id=users.id=tokens.id "+
      "where users.username like '"+name+"' and "+
      "tokens.token like '"+token+"';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
          callback(403,"Some error occured!");
        }
        else{
          for(let i=0;i<res.length;i++){
            if(res[i].thisSessionSteps>0){
              pocet++;
            }
          }
          let obj=new Object();
          obj.minutes=pocet*5;
          callback(200,JSON.stringify(obj)); 
        } 
      });
      con.end();
  });
});

//ToDo- arduino

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
    if (err) console.log(err);
    let sql="select id from users where arduinoid like '"+arduinoid+"';";
    con.query(sql,(err,res)=>{
      if(err) console.log(err);
      if(res.length==0){
        console.log("user with this arduinoid doesnt exists");
      }
      else{
        let id=res[0].id;
        let insertSQL="INSERT INTO data(id,thisSessionSteps,totalSteps)"+
        " VALUES("+id+","+sessionSteps+",@steps);";
        con.query(insertSQL,(err)=>{
          if(err) console.log(err);
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
