
import { Router } from "express";
import { nextTick } from "process";
import {
  startWorkflow,
  startSubscriptionWorkflow,
  cancelSubscriptionWorkflow,
} from "./client";
import { cancelSubscription, scheduleWorkflow } from "./workflows";
import {DBClient, DBConfig} from "./DBClient";

const routes = Router();

function CreateClient(): DBClient {
  const config:DBConfig = new DBConfig("localhost",54320,"user","password","content");
  return new DBClient(config);
}

routes.post("/api/start", async function (req, res) {
  try {
    await startSubscriptionWorkflow();
    return res.json({ message: "Subscription started" });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Subscription failed" });
  }
});

routes.post("/api/cancel", async function (req, res) {
  await cancelSubscriptionWorkflow();
  return res.json({ message: "Subscription canceled" });
});

routes.post("/api/publish", async function (req, res) {
  const startDate: string = req.body.startTime;
  const endDate: string = req.body.endTime;
  await scheduleWorkflow(startDate, endDate);
  return res.json({ message: "Schedule published" });
});

//API CRUD FUNCTIONS START HERE

routes.get("/api/schedules", async function (req, res) {
  const client:DBClient = CreateClient();
  const result = await client.GetAllSchedules();
  return result == null ? res.json({ message: "No schedules found" }) : res.json(result.rows);
});

routes.get("api/schedules:scheduleId", async function (req, res) {
  //TODO: Implement this
});

routes.post("/api/schedules", async function (req, res) {
 
    // Querying the client returns a query result promise
    // which is also an asynchronous result iterator.
    const startDate: string = req.body.startTime;
    const endDate: string = req.body.endTime;
    const contentId: string = req.body.contentId;
    const client:DBClient = CreateClient();
    const result = await client.AddSchedule(startDate, endDate, contentId);
    console.log(result);
    return result == null ? res.json("Could not add schedule") : res.json(result.rows);
});

routes.put("/api/schedules/:scheduleId", async function (req, res) {
    const scheduleId: string = req.params.scheduleId;
    const startDate: string = req.body.startTime;
    const endDate: string = req.body.endTime;
    const contentId: string = req.body.contentId;
    const client:DBClient = CreateClient();
    const result = await client.UpdateSchedule(scheduleId,contentId, startDate, endDate);
    return result == null ? res.json("Could not update schedule"): res.json(result.rows);
});

routes.delete("/api/schedules/:scheduleId", async function (req, res) {
    const scheduleId: string = req.params.scheduleId;
    const client:DBClient = CreateClient();
    const result = await client.DeleteSchedule(scheduleId);
    return result == null ? res.json("Could not delete schedule"): res.json(result.rows);
  });

export default routes;
