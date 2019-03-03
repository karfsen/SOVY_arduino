const http=require('http');
const express = require('express');
const mysql = require('mysql');

waitAndDo();

/*function getTotal(callback){
    
    const con=mysql.createConnection({
        host: "localhost",
        user: "pedometer",
        password: "160518",
        database: "pedometer",
        port: "3307"
    });

    con.connect((err)=>{
        if (err) throw err;
        let sql="select max(totalSteps) as totalSteps from data "+
        "INNER JOIN users on data.id=users.id "+ 
        "where users.id=1;";

        con.query(sql,(err,res)=>{
            if (err) throw err;
            console.log(res);
            value=res[0].totalSteps;
            console.log(value);
        });
        callback(value);
    });
    con.end();
}
*/

let totalSteps=19128;
function waitAndDo(times/*,totalSteps*/) {
    if(times < 1) {
      return;
    }
    setTimeout(()=> {

        const con=mysql.createConnection({
            host: "localhost",
            user: "pedometer",
            password: "160518",
            database: "pedometer",
            port: "3307"
        });

        let id=1;
        let steps=Math.floor(Math.random() * Math.floor(5));
        console.log(steps);
        con.connect((err)=>{
            if (err) throw err;      
            console.log("connected");
            totalSteps=totalSteps+steps;
            let sql="INSERT INTO data(id,thisSessionSteps,totalSteps) "+
            "VALUES("+id+","+steps+","+totalSteps+");";
            console.log(sql);
            con.query(sql,(err,res)=>{
                if (err) throw err;
                console.log("Data inserted into database:"+id+" "+steps+" "+totalSteps);
            });
            con.end();
        });
    waitAndDo(times+1);
    }, 
    60000);
  }

