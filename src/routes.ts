import { Console } from 'console';
import { Router } from 'express';
import { nextTick } from 'process';
import { startWorkflow, startSubscriptionWorkflow, cancelSubscriptionWorkflow } from './client';
import { cancelSubscription, scheduleWorkflow } from './workflows';

const routes = Router();

routes.post('/api/start', async function(req, res)
{
    //const param:string = req.body.param;
    try{
        await startSubscriptionWorkflow();
        return res.json({ message: "Subscription started" });
    }
    catch(err)
    {
        console.log(err);
        return res.json({ message: "Subscription failed" });
    }
    
});

routes.post("/api/cancel", async function(req,res){ 
    await cancelSubscriptionWorkflow();
    return res.json({ message: "Subscription canceled" });
});

routes.post("/api/publish", async function(req,res){
    const startDate:string = req.body.startTime;
    const endDate:string = req.body.endTime;
    await scheduleWorkflow(startDate, endDate);
    return res.json({ message: "Schedule published" });
});



export default routes;