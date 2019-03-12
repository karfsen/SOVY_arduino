const http=require('http');
const express = require('express');
const mysql = require('mysql');

waitAndDo();

let totalSteps=19128;
function waitAndDo() {
    
    setTimeout(()=> {

        const con=mysql.createConnection({
            host: "localhost",
            user: "pedometer",
            password: "160518",
            database: "pedometer",
            port: "3307"
        });

        let id=1;
        let steps=Math.floor(Math.random() * Math.floor(150));
        console.log(steps);
        con.connect((err)=>{
            if (err) throw err;      
            console.log("connected");
            totalSteps=totalSteps+steps;
            let sql="INSERT INTO data(id,thisSessionSteps) "+
            "VALUES("+id+","+steps+","+totalSteps+");";
            console.log(sql);
            con.query(sql,(err,res)=>{
                if (err) throw err;
                console.log("Data inserted into database:"+id+" "+steps);
            });
            con.end();
        });
    waitAndDo();
    }, 
    300000);
  }

