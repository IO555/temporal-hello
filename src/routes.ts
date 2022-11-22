import { Console } from 'console';
import { Router } from 'express';
import { startWorkflow, startSubscriptionWorkflow, cancelSubscriptionWorkflow } from './client';
import { cancelSubscription } from './workflows';

const routes = Router();

routes.post('/api/start', (req, res) => 
{
    let param:string = req.body.param;
    startSubscriptionWorkflow();
    return res.json({ message: "Subscription started" });
});

routes.post("/api/cancel", (req, res) => { 
    cancelSubscriptionWorkflow();
    return res.json({ message: "Subscription canceled" });
});



export default routes;