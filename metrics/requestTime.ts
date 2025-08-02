import client from "prom-client";

// it store the count of request in the fashion of histogram 
// it is using for response time 
export const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    // we have created some bucket and we always query how much request will less than something ot greater then something 
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000] // Define your own buckets here
});
