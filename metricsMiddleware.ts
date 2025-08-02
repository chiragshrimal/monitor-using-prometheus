import { requestCounter } from "./requestCount";
import {httpRequestDurationMicroseconds} from "./requestTime";
import {activeRequestsGauge} from "./activeCount";
import type { Request, Response, NextFunction } from "express";

export default function metricsMiddleware(req:Request, res:Response, next:NextFunction){

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