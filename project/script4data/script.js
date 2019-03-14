const http=require('http');
const express = require('express');
const mysql = require('mysql');

waitAndDo();

function waitAndDo() {
    
    setTimeout(()=> {

        const con=mysql.createConnection({
            host: "localhost",
            user: "pedometer",
            password: "160518",
            database: "pedometer",
            port: "3307"
        });

        let id=3;
        let steps=Math.floor(Math.random() * Math.floor(150));
        console.log(steps);
        con.connect((err)=>{
            if (err) throw err;      
            console.log("connected");
            let sql="INSERT INTO data(id,thisSessionSteps) "+
            "VALUES("+id+","+steps+");";
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

