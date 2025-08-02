// if server will start again  then that time old matric data will loose 
// but we have to care about rate (number of req/sec ) dont total request

import express from "express";
import type { Request, Response, NextFunction } from "express";
import client from "prom-client";
import metricsMiddleware from "./metricsMiddleware";

const app=express();

app.use(express.json());

app.use(metricsMiddleware);

app.get("/cpu",async(req,res)=>{

    // it has to wait for 10 second so that we can see active request
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

app.get("/users",(req,res)=>{
    res.json({
        message : "user"
    });
});

app.get("/metrics", async(req,res)=>{
    const metrics = await client.register.metrics();
    console.log(client.register.contentType);
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
});

app.listen(3000);