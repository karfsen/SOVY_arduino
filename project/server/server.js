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

app.post('/register',(req,res,callbackR)=>{
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
          callbackEnd(end);
        }
        else{
        con.query("SELECT id FROM users WHERE username like '"+req.body.username+"';",(err,res)=>{
          if(err) console.log(err);
          if(res.length==0){
            callbackR(401,"Error");
            callbackEnd(end); 
          }
          else{
          console.log("NEW USER! name: "+req.body.username+" password:"+req.body.password+" arduino id : "+req.body.arduinoid);
          //console.log("vybral som si ID NOVEHO USERA");
          con.query("INSERT INTO tokens VALUES("+res[0].id+",'');",(err)=>{
            if(err) console.log(err);
            else{
                //console.log("VLOZIL SOM ID USERA DO TABULY TOKENS a USERINFO");
                end=1;
                callbackEnd(end);
              }
            });
            callbackR(200,"New user: "+req.body.username+" Successfully registered!"); 
          }
        });
      }
    });
  });
});

//posielame JSON username password ak je spravny returnne JSON s username a token

app.post('/login',(req,res,callbackL)=>{
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
      //console.log("connected");
      
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
          //console.log(id);
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
        con.end();
      });
    }); 
  });

//posielame json v ktorom je username a token , ak je spravny nereturnne nič iba 200 kod a hlašku logged off

  app.post('/logout',(req,res,callbackout)=>{
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
          con.end();
        });
      }); 
    });

//request na ktory posielame JSON username  token old password new password

app.post('/changepassword',(req,res,callbackchpw)=>{
  console.log("Request on /changepassword");

  callbackchpw=function(status,value){
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
  let oldpw=req.body.oldpassword;
  let newpw=req.body.newpassword;
    //console.log(req.body.meno);
    //console.log(req.body.pass);
    //console.log(JSON.stringify(data));

    con.connect((err)=>{
      
      if (err) console.log(err);      
      //console.log("connected");
      
      let sql="SELECT * FROM users "+
      "INNER JOIN tokens on users.id=tokens.id "+
      "WHERE users.username like '"+name+"' "+
      "and tokens.token like '"+token+"' "+
      "and users.password like '"+oldpw+"';";
      //console.log(sql);

      con.query(sql,(err,res)=>{
        if(err) console.log(err);
       
        if(res.length==0){
          console.log("User: "+name+" with token: "+token+" is not logged in");
          callbackchpw(401,"Wrong inputs");
        }
        else{
          console.log("User: "+name+" with token: "+token+" is logged and using");
          //console.log(res);
          //console.log(id);
          let newpwSQL="UPDATE users set password='"+newpw+"' WHERE username like '"+name+"';";
          //console.log(tokenSQL);
          con.query(newpwSQL,(err)=>{
            if(err) console.log(err);
          });
          callbackchpw(200,JSON.stringify("Successfully changed password!"));
        }
        con.end();
      });
    }); 
  });

  app.post('/changearduino',(req,res,callbackcha)=>{
    console.log("Request on /changearduino");
  
    callbackcha=function(status,value){
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
  let arduino=req.body.arduinoid;
  //console.log(req.body.meno);
  //console.log(req.body.pass);
  //console.log(JSON.stringify(data));
  
  con.connect((err)=>{
        
    if (err) console.log(err);      
    //console.log("connected");
        
    let sql="SELECT * FROM users "+
    "INNER JOIN tokens on users.id=tokens.id "+
    "WHERE users.username like '"+name+"' "+
    "and tokens.token like '"+token+"' ";
    //console.log(sql);
  
    con.query(sql,(err,res)=>{
      if(err) console.log(err);
         
      if(res.length==0){
        console.log("User: "+name+" with token: "+token+" is not logged in");
        callbackcha(401,"Wrong inputs");
      }
      else{
        console.log("User: "+name+" with token: "+token+" is logged");
        //console.log(res);
        //console.log(id);
        let newaiSQL="UPDATE users set arduinoid='"+arduino+"' WHERE username like '"+name+"';";
        //console.log(newaiSQL);
        con.query(newaiSQL,(err)=>{
          if(err){
            console.log(err)
            callbackcha(403,"Arduino ID is taken");
          }
          else callbackcha(200,"Successfully changed arduinoid!");
        });
      }
      con.end();
    });
  }); 
});

//posielame json username token , príde json username arduinoid

app.post("/arduinoinfo",(req,res)=>{
    let username=req.body.username;
    let token=req.body.token;

    console.log("Request on /arduinoinfo");
    callbackai=function(status,value){
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

    let sql="SELECT username,arduinoid from users "+
    "INNER JOIN tokens on users.id=tokens.id "+
    "WHERE users.username like '"+username+"' and "+
    "tokens.token like '"+token+"';";
    //console.log(sql);
    con.query(sql,(err,res)=>{
      if(err) console.log(err);
      if(res.length==0){
        callbackai(403,"User not logged ");
      }
      else{
        callbackai(200,res);
      }
      con.end();
    });
  });
});

//request na ktory posielame JSON NAPR{"username":"xxx","token":"dafds664fd5s67f8sdf"} vrati sa JSON pole objektov o chodeni(data pre graf)
//funguje

app.post('/todaysteps',(req,res,callbacktds)=>{
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
//console.log(date);
  let name=req.body.username;
  let token=req.body.token;
  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select (DATE_FORMAT(time, '%d.%m.%Y %H:%i')) as time,thisSessionSteps as steps from data "+
      "INNER JOIN users on data.id=users.id "+ 
      "INNER JOIN tokens on users.id=tokens.id "+
      "where users.username like '"+name+"' and "+
      "tokens.token like '"+token+"' and "+
      "time >= '2019-03-"+date+" 00:00:00';";
      //console.log(sql);
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        //console.log(res);

        if(res.length==0){
          callbacktds(403,"User doesn't have steps in last day.");
        }
        else{
          callbacktds(200,res);
        }
        con.end();
      });
  });
});

//request v ktorom neposielame nič , prijmeme JSON pole každeho usera  jeho dnešnych krkokov
//funguje

app.post('/alltodaysteps',(req,res,callbackatds)=>{
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
//console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select username,sum(thisSessionSteps) as todaysteps from users "+
      "INNER JOIN data on users.id=data.id "+
      "where time>='2019-03-"+date+" 00:00:00' group by username order by todaysteps desc;";
      //console.log(sql);
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        callbackatds(200,data);  
        con.end();
      });
  });
});

//request na ktory neposielame nič , prijmame JSON kde je sumary číslo spočítaných krokov počas dnešného dňa(všetkých userov)
//funguje
app.post('/gettodaysteps',(req,res,callbackGS)=>{
  console.log("Request on /gettodaysteps");

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
//console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select sum(thisSessionSteps) as sumary from data "+
      "where time >= '2019-03-"+date+"  00:00:00';";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        if(data[0].sumary==null) data[0].sumary=0;
        //console.log(res);
        callbackGS(200,data);  
        con.end();
      });
  });
});

//api ktore pošle počet dnešnych krokov prihlaseneho usera
//funguje

app.post('/getsteps',(req,res,callbackGS)=>{
  console.log("Request on /getsteps");

  callbackGS=function(status,value){
    res.status(status).send(value);
  };
  let username=req.body.username;
  let token=req.body.token;

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
//console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
    let sql="select sum(thisSessionSteps) as todaysteps from data "+
    "INNER JOIN users on data.id=users.id INNER JOIN tokens on users.id=tokens.id "+
    "where username like '"+username+"' and token like '"+token+"' and time>='2019-03-"+date+" 00:00:00';";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        if(data[0].todaysteps==null) data[0].todaysteps=0;
        //console.log(res);
        callbackGS(200,data);  
        con.end();
      });
  });
});

//neposielame nič , príde json celkovych krokov všetkych userov spolu

app.post('/getalltimesteps',(req,res,callbackGAS)=>{
  console.log("Request on /getalltimesteps");

  callbackGAS=function(status,value){
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
//console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select sum(thisSessionSteps) as sumary from data;";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        //console.log(res);
        if(data[0].sumary==null) data[0].sumary=0;
        callbackGAS(200,data);  
        con.end();
      });
  });
});

//neposielame nič , naspäť príde JSON pole všetkych userov čo niečo niekedy prešli a ich celkovy počet krokov
//funguje

app.post('/alltimeuserssteps',(req,res,callbackATUS)=>{
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
//console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select users.username,sum(thisSessionSteps) as sum from data "+
      "INNER JOIN users on data.id=users.id group by users.username order by sum desc;";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        //console.log(res);
        if(data[0].sum==null) data[0].sum=0;
        callbackATUS(200,data);  
        con.end();
      });
  });
});

//posielame json username token a pride json userovho celkoveho počtu krokov

app.post('/totalusersteps',(req,res,callbackATUS)=>{
  console.log("Request on /alltimeuserssteps");

  callbackATUS=function(status,value){
    res.status(status).send(value);
  };

  let username=req.body.username;
  let token=req.body.token;
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
//console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select sum(thisSessionSteps) as sum from data "+
      "INNER JOIN users on data.id=users.id inner join tokens on users.id=tokens.id "+
      "where users.username like '"+username+"' and tokens.token like '"+token+"';";

      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        let data=res;
        //console.log(res);
        if(data[0].sum==null) data[0].sum=0;
        callbackATUS(200,data);  
        con.end();
      });
  });
});

// naspäť príde JSON s počtom minút koľko dnes nachodili všetci useri

app.post('/gettodayminutes',(req,res,callbackGTDM)=>{
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
//console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select * from data where time >='2019-03-"+date+" 00:00:00';";
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
      con.end();
    });
  });
});


//neposielame nič , naspäť príde JSON s počtom minút koľko dnes nachodili všetci useri

app.post('/gettodayminutes',(req,res,callbackGTDM)=>{
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
//console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select * from data where time >='2019-03-"+date+" 00:00:00';";
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
      con.end();
    });
  });
});

//posielame JSON obsahujuci username a token vracia JSON počtu minut jedneho usera za jeden den
//funguje

app.post('/getusertodayminutes',(req,res,callbackGUTM)=>{
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
//console.log(date);
  let name=req.body.username;
  let token=req.body.token;
  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select thisSessionSteps from data "+ 
      "INNER JOIN users on data.id=users.id "+
      "INNER JOIN tokens on users.id=tokens.id "+
      "where users.username like '"+name+"' and "+
      "tokens.token like '"+token+"' and "+
      "time >='2019-03-"+date+" 00:00:00';";
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
          obj.username=name;
          obj.minutes=pocet*5;
          callbackGUTM(200,JSON.stringify(obj)); 
        }
        con.end();
      });
  });
});

//returnne JSON celkoveho počtu minut ktory všetci spolu nachodili
//funguje

app.post('/getalltimeminutes',(req,res,callbackGATM)=>{
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
//console.log(date);

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
        con.end();
      });
  });
});

//returnne JSON celkoveho počtu minut ktore user nachodil
//funguje
app.post('/getuseralltimeminutes',(req,res,callbackGUATM)=>{
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
//console.log(date);

  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select * from data "+ 
      "INNER JOIN users on data.id=users.id "+
      "INNER JOIN tokens on users.id=tokens.id "+
      "where users.username like '"+name+"' and "+
      "tokens.token like '"+token+"';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
          let obj=new Object();
          obj.username=name;
          obj.minutes=pocet*5;
          callbackGUATM(200,obj);
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
        con.end(); 
      });
  });
});

//request ktory pošle userove info.
//funguje

app.post("/userinfo",(req,res,callbackUI)=>{
  console.log("Request on /userinfo");
  
    let con=mysql.createConnection({
      host: "localhost",
      user: "pedometer",
      password: "160518",
      database: "pedometer",
      port: "3307"
  });
  let username=req.body.username;
  let token=req.body.token;

  callbackUI=function(status,value){
    res.status(status).send(value);
  };
  con.connect((err)=>{
    if (err) console.log(err);
      let sql="select (DATE_FORMAT(time, '%d.%m.%Y %H:%i')) as time,username,weight,height,age from userinfo "+ 
      "INNER JOIN users on userinfo.id=users.id "+
      "INNER JOIN tokens on users.id=tokens.id "+
      "where users.username like '"+username+"' and "+
      "tokens.token like '"+token+"';";
      //console.log(sql);
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
          callbackUI(403,"No data about this user");
        }
        else{
          callbackUI(200,res); 
        }
        con.end();
      });
  });
});


//request ktory zmeni userovi info.

app.post("/setuserinfo",(req,res,callbackSUI)=>{
  console.log("Request on /setuserinfo");
  //console.log(req.body);
    let con=mysql.createConnection({
      host: "localhost",
      user: "pedometer",
      password: "160518",
      database: "pedometer",
      port: "3307"
  });
  let username=req.body.username;
  let token=req.body.token;
  let age=req.body.age;
  let height=req.body.height;
  let weight=req.body.weight;

  callbackSUI=function(status,value){
    res.status(status).send(value);
  };
  con.connect((err)=>{
    if (err) console.log(err);
      let sql="SELECT users.id,username,token FROM users "+ 
      "INNER JOIN tokens on users.id=tokens.id "+
      "where users.username like '"+username+"' and "+
      "tokens.token like '"+token+"';";
      //console.log(sql);
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
            callbackSUI(403,"Wrong username or not logged user");
        }
        else{
          let id=res[0].id;
          //console.log(id);
          if(age!=undefined)
            {
              if(height!=undefined)
              {
                if(weight!=undefined)
                {
                  let insertSQL="INSERT INTO userinfo(id,weight,height,age) VALUES("+id+","+weight+","+height+","+age+");";
                  con.query(insertSQL,(err)=>{
                    if(err) console.log(err);
                    else callbackSUI(200,"Succesfully added new data!"); 
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
                if(weight!=undefined)
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
              if(height!=undefined)
              {
                if(weight!=undefined)
                {
                  let insertSQL="INSERT INTO userinfo(id,weight,height) VALUES("+id+","+weight+","+height+");";
                  con.query(insertSQL,(err)=>{
                    if(err) console.log(err);
                    callbackSUI(200,"Succesfully added new data!"); 
                  });
                }
                else
                {
                  let insertSQL="INSERT INTO userinfo(id,height) VALUES("+id+","+height+");";
                  con.query(insertSQL,(err)=>{
                    if(err) console.log(err);
                    else callbackSUI(200,"Succesfully added new data!"); 
                  });
                }
              }
              else
              {
                if(weight!=undefined){
                  let insertSQL="INSERT INTO userinfo(id,weight) VALUES("+id+","+weight+");";
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
        con.end();
      });
  });
});

//Request ktory prida do databazy info o vypitej vode

app.post("/drink",(req,res,callbackDR)=>{
  console.log("Request on /drink");
  
    let con=mysql.createConnection({
      host: "localhost",
      user: "pedometer",
      password: "160518",
      database: "pedometer",
      port: "3307"
  });
  let username=req.body.username;
  let token=req.body.token;
  let water=req.body.water;

  callbackDR=function(status,value){
    res.status(status).send(value);
  };
  con.connect((err)=>{
    let sql="SELECT users.id,username,token FROM users "+ 
      "INNER JOIN tokens on users.id=tokens.id "+
      "where users.username like '"+username+"' and "+
      "tokens.token like '"+token+"';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
            callbackDR(403,"Wrong username or not logged user");
        }
        else{
          let id=res[0].id;
          let insertSQL="INSERT INTO water(id,mlOfWater) values("+id+","+water+");";
          con.query(insertSQL,(err)=>{
            if(err) console.log(err);
            else callbackDR(200,"Succesfully added new data!");
          });
        }
        con.end();
    });
  });
});

//Request ktory pošle nas5 data o tom koľko user kedy vypil(ak zadal)

app.post("/showdrink",(req,res,callbackSD)=>{
  console.log("Request on /showdrink");
  
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

  let username=req.body.username;
  let token=req.body.token;

  callbackSD=function(status,value){
    res.status(status).send(value);
  };
  con.connect((err)=>{
    let sql="SELECT (DATE_FORMAT(time, '%d.%m.%Y %H:%i')) as time,username,mlOfWater FROM users "+ 
      "INNER JOIN tokens on users.id=tokens.id "+
      "INNER JOIN water on users.id=water.id "+
      "where users.username like '"+username+"' and "+
      "tokens.token like '"+token+"' and "+
      "time >='2019-03-"+date+" 00:00:00';";
      con.query(sql,(err,res)=>{
        if (err) console.log(err);
        if(res.length==0){
            callbackSD(403,res);
        }
        else{
          callbackSD(200,res);
        }
      con.end();
      });
    });
  });

//ToDo- arduino

app.post("/sendsteps",(req,res,callbackSS)=>{
  console.log("Request on /sendsteps");
  //console.log(req);
  //console.log(req.body);
  callbackSS=function(status){
    res.status(status).send();
  };

  let con=mysql.createConnection({
    host: "localhost",
    user: "pedometer",
    password: "160518",
    database: "pedometer",
    port: "3307"
});

let arduinoid=req.body.arduinoid;
let sessionSteps=req.body.sessionSteps;
console.log(arduinoid);
console.log(sessionSteps);

  con.connect((err)=>{
    if (err) console.log(err);
    let sql="select id from users where arduinoid like '"+arduinoid+"';";
    con.query(sql,(err,res)=>{
      if(err) console.log(err);
      if(res.length==0){
        console.log("user with this arduinoid doesnt exists");
        callbackSS(200);
      }
      else{
        let id=res[0].id;
        let insertSQL="INSERT INTO data(id,thisSessionSteps)"+
        " VALUES("+id+","+sessionSteps+");";
        con.query(insertSQL,(err)=>{
          if(err) console.log(err);
          console.log("I have inserted data to database!");
        });
        callbackSS(200);
      }
      con.end();
    });
  });
});

//Zadefinovanie portu servera.

app.listen(1203,()=>{
    console.log("Sever listening on port 1203");
});
