import { Console } from 'console';
import { Router } from 'express';
import { nextTick } from 'process';
import { startWorkflow, startSubscriptionWorkflow, cancelSubscriptionWorkflow } from './client';
import { cancelSubscription } from './workflows';

const routes = Router();

routes.post('/api/start', async function(req, res)
{
    //const param:string = req.body.param;
    try{
        await startSubscriptionWorkflow();
        return res.json({ message: "Subscription started" });
    }catch(err)
    {
        console.log(err);
        return res.json({ message: "Subscription failed" });
    }
    
});

routes.post("/api/cancel", async function(req,res){ 
    await cancelSubscriptionWorkflow();
    return res.json({ message: "Subscription canceled" });
});



export default routes;