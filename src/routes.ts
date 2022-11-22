import { Console } from 'console';
import { Router } from 'express';
import run from "./client";

const routes = Router();

routes.post('/api/start', (req, res) => 
{
    let param:string = req.body.param;
    let result =  req.app.locals.needed;
    startWorkflow(param);
   return res.json({ message: result });
});

const startWorkflow = (param:string) => {
    run(param).catch((err) => {
        console.error(err);
        process.exit(1);
      });
 };

export default routes;