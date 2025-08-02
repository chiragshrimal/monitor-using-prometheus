import client from "prom-client";

// create a gauge matric 
// this gauge can be increase or decrease 
// it can count only that req which are active mean which did not resposed till now
//  it is using for number of active request can be increase or decrease
export const activeRequestsGauge = new client.Gauge({
    name: 'active_requests',
    help: 'Number of active requests'
});

