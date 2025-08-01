// if server will start again  then that time old matric data will loose 
// but we have to care about rate (number of req/sec ) dont total request

import express from "express";
import type { Request, Response, NextFunction } from "express";
import client from "prom-client";

const app=express();

// Create a counter metric
// counter metric will always be increase 
const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    // we dont have to added any labelNames which have infinite value because 
    // it can take many row 
    labelNames: ['method', 'route', 'status_code']
});

// create a gauge matric 
// this gauge can be increase or decrease 
// it can count only that req which are active mean which did not resposed till now
const activeRequestsGauge = new client.Gauge({
    name: 'active_requests',
    help: 'Number of active requests'
});

// it store the count of request in the fashion of histogram 
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    // we have created some bucket and we always query how much request will less than something 
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000] // Define your own buckets here
});

function middleware(req:Request, res:Response, next:NextFunction){

    activeRequestsGauge.inc();

 const startTime = Date.now();

//  it is good because whenever in the route have any async function then it helps 
    res.on('finish', () => {
        const endTime = Date.now();
        const duration = endTime-startTime;
        console.log(`Request took ${endTime - startTime}ms`);

        // Increment request counter
        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });

        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, duration);


        activeRequestsGauge.dec();
    });

    next();
}

app.use(middleware);

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

    const endTime=Date.now();
});

app.get("/metrics", async(req,res)=>{
    const metrics = await client.register.metrics();
    console.log(client.register.contentType);
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
});

app.listen(3000);