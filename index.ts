// if server will start again  then that time old matric data will loose 
// but we have to care about rate (number of req/sec ) dont total request

import express from "express";
import client from "prom-client";
import metricsMiddleware from "./metricsMiddleware";
import auth from 'basic-auth';


const PROMETHEUS_USER="chirag";
const PROMETHEUS_PASS= "chirag@1711";

const app=express();

app.use(express.json());

app.use(metricsMiddleware);

app.get("/cpu",async(req,res)=>{

    // // it has to wait for 10 second so that we can see active request
    // await new Promise(s=>setTimeout(() => {
        
    // }, 10000));

    // this is cpu intensive task 
    for(let i=0;i<100000;i++){
        Math.random();
    }

    res.json({
        message : "cpu"
    });
});

app.get("/users",async (req,res)=>{

    await new Promise((resolve)=>setTimeout(resolve, Math.random()*2500));

    res.json({
        name: "Jone Doe",
        age: 25,
    })
});

app.get("/metrics", async(req,res)=>{

//     const credentials = auth(req);
//   if (
//     !credentials ||
//     credentials.name !== PROMETHEUS_USER ||
//     credentials.pass !== PROMETHEUS_PASS
//   ) {
//     return res.status(401).send('Access denied');
//   }

//   console.log("hello from matric");

    const metrics = await client.register.metrics();
    console.log(client.register.contentType);
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
});

app.listen(3000);