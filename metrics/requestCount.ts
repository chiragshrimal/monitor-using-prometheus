import client from "prom-client";

// Create a counter metric
// counter metric will always be increase 
//  it is using for number of request 
export const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    // we dont have to added any labelNames which have infinite value because 
    // it can take many row 
    labelNames: ['method', 'route', 'status_code']
});