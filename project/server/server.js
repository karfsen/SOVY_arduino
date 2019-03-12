//zadefinovanie ake knižnice používame
const http=require('http');
const express = require('express');
const mysql = require('mysql');
const TokenGenerator = require('uuid-token-generator');
const cors=require('cors');


//Definuje token generaciu(pomocou knižnice na tokeny)
const tokgen = new TokenGenerator(128, TokenGenerator.BASE62);
//console.log(tokgen);
var app=express();
app.use(express.json());
app.use(cors());

//Tu je registracia užívateľa , je to viacmenej na 100% hotove

app.post('/register',(req,res,callback)=>{
console.log("Request on /register");
let end=0;
//callback asynchronnej funkcie
  callbackEnd=function(value){
    if(value==1)
    con.end();
  };

  callbackR=function(status,value){
    res.status(status).send(value);
  };

let con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

  con.connect((err)=>{
    if (err) console.log(err);      
      //console.log("connected");
      let sql = "INSERT INTO users(username,password,arduinoID) "+
      "VALUES ('"+req.body.username+"','"+req.body.password+"','"+req.body.arduinoid+"');";
      //console.log(sql);
      con.query(sql,(err,res)=>{
        if (err){
          console.log(err);
          callbackR(403,"This username with this arduino is taken!");
        }
        else{
        con.query("SELECT id FROM users WHERE username like '"+req.body.username+"';",(err,res)=>{
          if(err) console.log(err);
          if(res.length==""){
            callbackR(401,"Error"); 
          }
          else{
          console.log("NEW USER! name: "+req.body.username+" password:"+req.body.password+" arduino id : "+req.body.arduinoid);
          console.log("vybral som si ID NOVEHO USERA");
          con.query("INSERT INTO tokens VALUES("+res[0].id+",'');",(err)=>{
            if(err) console.log(err);
            else{
                console.log("VLOZIL SOM ID USERA DO TABULY TOKENS a USERINFO");
                end=1;
                callbackEnd(end);
              }
            });
            callbackR(200,"New user: "+req.body.username+" Successfully registered!"); 
          }
        });
      }
    });
    con.end();
  });
});

//posielame JSON username password ak je spravny returnne JSON s username a token

app.post('/login',(req,res,callback)=>{
  console.log("Request on /login");

  callbackL=function(status,value){
    res.status(status).send(value);
  };


  let con=mysql.createConnection({
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
      
      if (err) console.log(err);      
      console.log("connected");
      
      let sql="SELECT id,username,password FROM users "+
      "WHERE username like '"+name+"' "+
      "and password like '"+pw+"';";
      //console.log(sql);

      con.query(sql,(err,res)=>{
        if(err) console.log(err);
       
        if(res.length==0){
          console.log("User: "+name+" with password: "+pw+" is not in database");
          callbackL(401,"Incorrect Username or password!");
        }
        else{
          console.log("User: "+name+" with password: "+pw+" is in database");
          //console.log(res);
          let id=res[0].id;
          console.log(id);
          token=tokgen.generate();
          //console.log(token);
          let obj=new Object();
          obj.username=res[0].username;
          obj.token=token;
          let tokenSQL="UPDATE tokens set token='"+token+"' WHERE id="+id+";"
          //console.log(tokenSQL);
          con.query(tokenSQL,(err)=>{
            if(err) console.log(err);
          });
          callbackL(200,JSON.stringify(obj));
        }
      });
      con.end();
    }); 
  });

//posielame json v ktorom je username a token , ak je spravny nereturnne nič iba 200 kod a hlašku logged off

  app.post('/logout',(req,res,callback)=>{
    console.log("Request on /logout");

    callbackout=function(status,value){
      res.status(status).send(value);
    };
  
  
    let con=mysql.createConnection({
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
        
        if (err) console.log(err);      
        //console.log("connected");
        
        let sql="SELECT users.id,users.username FROM users "+
        "INNER JOIN tokens on users.id=tokens.id "+
        "WHERE users.username like '"+name+"' "+
        "and tokens.token like '"+token+"';";
        //console.log(sql);
  
        con.query(sql,(err,res)=>{
          if(err) console.log(err);
         
          if(res.length==0){
            console.log("User: "+name+" with token: "+token+" is not logged in");
            callbackout(401,"User not existing or not logged in");
          }
          else{
            console.log("User: "+name+" with token: "+token+" is logged");
            //console.log(res);
            let id=res[0].id;
            //console.log(id);
            let tokenSQL="UPDATE tokens set token='' WHERE id="+id+";"
            //console.log(tokenSQL);
            con.query(tokenSQL,(err)=>{
              if(err) console.log(err);
            });
            callbackout(200,JSON.stringify("Successfully logged off!"));
          }
        });
        con.end();
      }); 
    });

//request na ktory posielame JSON NAPR{"username":"xxx","token":"dafds664fd5s67f8sdf"} vrati sa počet dnešných krokov prihlaseneho usera

app.post('/todaysteps',(req,res)=>{
  console.log("Request on /todaysteps");

  callbacktds=function(status,value){
    res.status(status).send(value);
  };

  let con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
if(date<10){
  date="0"+date;
}
console.log(date);
  let name=req.body.username;
  let token=req.body.token;
  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select time,thisSessionSteps from data "+
      "INNER JOIN users "+ 
      "INNER JOIN tokens on data.id=users.id=tokens.id "+
      "where users.username like '"+name+"' and "+
      "tokens.token like '"+token+"' and "+
      "time >= '2019-03-"+date+"%';";
      //console.log(sql);
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        //console.log(res);

        if(res.length==0){
          callbacktds(403,"User doesnt have steps in last day/Wrong token : "+res);
        }
        else{
          callbacktds(200,res);
        }
      });
      con.end();
  });
});

//request v ktorom neposielame nič , prijmeme JSON v ktorom je meno a počet krokov každeho usera  počas aktuálneho dňa 

app.post('/alltodaysteps',(req,res)=>{
  console.log("Request on /alltodaysteps");

  callbackatds=function(status,value){
    res.status(status).send(value);
  };

  let con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
//console.log(date);
if(date<10){
  date="0"+date;
}
console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select username,sum(thisSessionSteps) as todaysteps from data "+
      "INNER JOIN users on data.id=users.id "+
      "where time >= '2019-03-"+date+"%' group by username;";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        callbackatds(200,data);  
      });
      con.end();
  });
});

//request na ktory neposielame nič , prijmame JSON kde je sumary číslo spočítaných krokov počas dnešného dňa(všetkých userov)

app.post('/getsteps',(req,res)=>{
  console.log("Request on /getsteps");

  callbackGS=function(status,value){
    res.status(status).send(value);
  };

  let con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
//console.log(date);
if(date<10){
  date="0"+date;
}
console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select sum(thisSessionSteps) as sumary from data "+
      "where time >= '2019-03-"+date+"%';";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        //console.log(res);
        callbackGS(200,data);  
      });
      con.end();
  });
});

//neposielame nič , naspäť príde JSON všetkych userov čo niečo niekedy prešli a ich celkovy počet krokov

app.post('/alltimeuserssteps',(req,res)=>{
  console.log("Request on /alltimeuserssteps");

  callbackATUS=function(status,value){
    res.status(status).send(value);
  };

  let con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
//console.log(date);
if(date<10){
  date="0"+date;
}
console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select users.username,sum(thisSessionSteps) as sum from data "+
      "INNER JOIN users on data.id=users.id group by users.username;";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        //console.log(res);
        callbackATUS(200,data);  
      });
      con.end();
  });
});

//neposielame nič , naspäť príde JSON s počtom minút koľko dnes nachodili všetci useri

app.post('/gettodayminutes',(req,res)=>{
  console.log("Request on /gettodayminutes");
  let pocet=0;
  callbackGTDM=function(status,value){
    res.status(status).send(value);
  };

  let con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
//console.log(date);
if(date<10){
  date="0"+date;
}
console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select * from data where time >='2019-03-"+date+"%';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){  
          let obj=new Object();
          obj.minutes=pocet*5;
        callbackGTDM(200,obj);
        }
        else{
        for(let i=0;i<res.length;i++){
          if(res[i].thisSessionSteps>0){
            pocet++;
          }
        }
        let obj=new Object();
        obj.minutes=pocet*5;
        callbackGTDM(200,JSON.stringify(obj));  
      }
    });
    con.end();
  });
});

//posielame JSON obsahujuci username a token vracia JSON počtu minut jedneho usera za jeden den

app.post('/getusertodayminutes',(req,res)=>{
  console.log("Request on /getusertodayminutes");

  let pocet=0;
  callbackGUTM=function(status,value){
    res.status(status).send(value);
  };

  let con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
//console.log(date);
if(date<10){
  date="0"+date;
}
console.log(date);
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
          let obj=new Object();
          obj.username=name;
          obj.minutes=pocet*5;
          callbackGUTM(200,obj); 
        }
        else{
          for(let i=0;i<res.length;i++){
            if(res[i].thisSessionSteps>0){
              pocet++;
            }
          }
          let obj=new Object();
          obj.minutes=pocet*5;
          callbackGUTM(200,JSON.stringify(obj)); 
        }
      });
      con.end();
  });
});

//returnne JSON celkoveho počtu minut ktory všetci spolu nachodili

app.post('/getalltimeminutes',(req,res)=>{
  console.log("Request on /getalltimeminutes");

  let pocet=0;
  callbackGATM=function(status,value){
    res.status(status).send(value);
  };

  let con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
//console.log(date);
if(date<10){
  date="0"+date;
}
console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select * from data;"
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
          let obj=new Object();
          obj.minutes=pocet*5;
          callbackGATM(403,obj);
        }
        else{
          for(let i=0;i<res.length;i++){
            if(res[i].thisSessionSteps>0){
              pocet++;
            }
          }
          let obj=new Object();
          obj.minutes=pocet*5;
          callbackGATM(200,JSON.stringify(obj));  
        }
      });
      con.end();
  });
});

//returnne JSON celkoveho počtu minut ktore user nachodil

app.post('/getuseralltimeminutes',(req,res)=>{
  console.log("Request on /getuseralltimeminutes");
  let name=req.body.username;
  let token=req.body.token;
  let pocet=0;
  callbackGUATM=function(status,value){
    res.status(status).send(value);
  };

  let con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

var date = new Date().getDate();
//console.log(date);
if(date<10){
  date="0"+date;
}
console.log(date);

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
          let obj=new Object();
          obj.username=name;
          obj.minutes=pocet*5;
          callbackGUATM(403,obj);
        }
        else{
          for(let i=0;i<res.length;i++){
            if(res[i].thisSessionSteps>0){
              pocet++;
            }
          }
          let obj=new Object();
          obj.username=name;
          obj.minutes=pocet*5;
          callbackGUATM(200,JSON.stringify(obj)); 
        } 
      });
      con.end();
  });
});

//request ktory pošle userove info.

app.post("/userinfo",(req,res)=>{
  console.log("Request on /userinfo");
  
    let con=mysql.createConnection({
      host: "localhost",
      user: "pedometer",
      password: "160518",
      database: "pedometer",
      port: "3307"
  });
  let username=req.username;
  let token=req.token;

  callbackUI=function(status,value){
    res.status(status).send(value);
  };
  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select * from userinfo "+ 
      "INNER JOIN users "+
      "INNER JOIN tokens on userinfo.id=users.id=tokens.id "+
      "where users.username like '"+username+"' and "+
      "tokens.token like '"+token+"';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
          callbackSUI(403,"No data about this user");
        }
        else{
          callbackSUI(200,res); 
        }
      });
      con.end();
  });
});


//request ktory zmeni userovi info.

app.post("/setuserinfo",(req,res)=>{
  console.log("Request on /userinfo");
  
    let con=mysql.createConnection({
      host: "localhost",
      user: "pedometer",
      password: "160518",
      database: "pedometer",
      port: "3307"
  });
  let username=req.username;
  let token=req.token;
  let age=req.age;
  let height=req.height;
  let weight=req.weight;

  callbackSUI=function(status,value){
    res.status(status).send(value);
  };
  con.connect((err)=>{
    if (err) console.log(err);
      let sql="SELECT id,username,token FROM users "+ 
      "INNER JOIN tokens on users.id=tokens.id "+
      "where users.username like '"+username+"' and "+
      "tokens.token like '"+token+"';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
            callbackSUI(403,"Wrong username or not logged user");
        }
        else{
          let id=res[0].id;

          if(age!="")
            {
              if(height!="")
              {
                if(weight!="")
                {
                  let insertSQL="INSERT INTO userinfo(id,weight,height,age) VALUES("+id+","+weight+","+height+","+age+");";
                  con.query(insertSQL,(err)=>{
                    if(err) console.log(err);
                  });
                }
                else
                {
                  let insertSQL="INSERT INTO userinfo(id,height,age) VALUES("+id+","+height+","+age+");";
                  con.query(insertSQL,(err)=>{
                    if(err) console.log(err);
                    else callbackSUI(200,"Succesfully added new data!"); 
                  });
                }
              }
              else
              {
                if(weight!="")
                {
                  let insertSQL="INSERT INTO userinfo(id,weight,age) VALUES("+id+","+weight+","+age+");";
                  con.query(insertSQL,(err)=>{
                    if(err) console.log(err);
                    else callbackSUI(200,"Successfully added new data!");
                  });
                }
                else
                {
                  let insertSQL="INSERT INTO userinfo(id,age) VALUES("+id+","+age+");";
                  con.query(insertSQL,(err)=>{
                    if(err) console.log(err);
                    callbackSUI(200,"Succesfully added new data!"); 
                  });
                }  
              }
            }

            else
            {
              if(height!="")
              {
                if(weight!="")
                {
                  let insertSQL="INSERT INTO userinfo(id,weight,height) VALUES("+id+","+weight+","+height+");";
                  con.query(insertSQL,(err)=>{
                    if(err) console.log(err);
                  });
                }
                else
                {
                  let insertSQL="INSERT INTO userinfo(id,height,age) VALUES("+id+","+height+");";
                  con.query(insertSQL,(err)=>{
                    if(err) console.log(err);
                    else callbackSUI(200,"Succesfully added new data!"); 
                  });
                }
              }
              else
              {
                if(weight!=""){
                  let insertSQL="INSERT INTO userinfo(id,weight,age) VALUES("+id+","+weight+");";
                  con.query(insertSQL,(err)=>{
                    if(err) console.log(err);
                    else callbackSUI(200,"Successfully added new data!");
                  });
                }
                else
                {
                  callbackSUI(403,"Add at least 1 value !");
                }  
              }
            }
        }
      });
      con.end();
  });
});

//Request ktory prida do databazy info o vypitej vode

app.post("/drink",(req,res)=>{
  console.log("Request on /drink");
  
    let con=mysql.createConnection({
      host: "localhost",
      user: "pedometer",
      password: "160518",
      database: "pedometer",
      port: "3307"
  });
  let username=req.username;
  let token=req.token;
  let water=req.water;

  callbackUI=function(status,value){
    res.status(status).send(value);
  };
  con.connect((err)=>{
    let sql="SELECT id,username,token FROM users "+ 
      "INNER JOIN tokens on users.id=tokens.id "+
      "where users.username like '"+username+"' and "+
      "tokens.token like '"+token+"';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
            callbackSUI(403,"Wrong username or not logged user");
        }
        else{
          let id=res[0].id;
          let insertSQL="INSERT INTO water values("+id+","+water+");";
          con.query(insertSQL,(err)=>{
            if(err) console.log(err);
            else callbackSUI(200,"Succesfully added new data!");
          });
        }
    });
    con.end();
  });
});

//Request ktory pošle nas5 data o tom koľko user kedy vypil(ak zadal)

app.post("/showdrink",(req,res)=>{
  console.log("Request on /drink");
  
    let con=mysql.createConnection({
      host: "localhost",
      user: "pedometer",
      password: "160518",
      database: "pedometer",
      port: "3307"
  });
  let username=req.username;
  let token=req.token;
  let water=req.water;

  callbackUI=function(status,value){
    res.status(status).send(value);
  };
  con.connect((err)=>{
    let sql="SELECT username,mlOfWater FROM users "+ 
      "INNER JOIN tokens "+
      "INNER JOIN water on users.id=tokens.id=water.id "+
      "where users.username like '"+username+"' and "+
      "tokens.token like '"+token+"';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
            callbackSUI(403,"Wrong username or not logged user");
        }
        else
        {
            callbackSUI(200,res);
        }
      });
      con.end();
    });
  });

//ToDo- arduino

app.post("/sendsteps",(req,res)=>{
  console.log("Request on /sendsteps");

  let con=mysql.createConnection({
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
        res.status(200).send();
      }
      else{
        let id=res[0].id;
        let insertSQL="INSERT INTO data(id,thisSessionSteps)"+
        " VALUES("+id+","+sessionSteps+");";
        con.query(insertSQL,(err)=>{
          if(err) console.log(err);
          console.log("I have inserted data to database!");
        });
      }
    });
    con.end();
  });
});

//Zadefinovanie portu servera.

app.listen(1203,()=>{
    console.log("Sever listening on port 1203");
});
