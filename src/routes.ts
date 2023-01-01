
import { Router } from "express";
import { nextTick } from "process";
import { validateDate } from "./validate-params";
import { convertRow, convertRows } from "./dataTypeConverter";
import {
  startScheduleWorkflow,
  startSubscriptionWorkflow,
  cancelSubscriptionWorkflow,
  startGetAllSchedulesWorkflow,
  startAddScheduleWorkflow,
  startUpdateScheduleWorkflow,
  startDeleteScheduleWorkflow
} from "./client";
import { cancelSubscription, scheduleWorkflow } from "./workflows";
import {DBClient, DBConfig} from "./DBClient";

const routes = Router();

function CreateClient(): DBClient {
  const config:DBConfig = new DBConfig("localhost",54320,"user","password","content");
  return new DBClient(config);
}

//simple demo routes to start workflows start here

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
  await startScheduleWorkflow(startDate, endDate);
  return res.json({ message: "Schedule published" });
});

//API CRUD FUNCTIONS START HERE

routes.get("/api/schedules", async function (req, res) {
  const client:DBClient = CreateClient();
  const result = await client.GetAllSchedules();
  if(result == null)
  {
    return res.status(404).json({ message: "No schedules found" });
  }
  const schedules = convertRows(result.rows);
  return res.json(schedules);
});

routes.get("/api/schedules/:id", async function (req, res) {
  //TODO: Implement this
  const client:DBClient = CreateClient();
  const result = await client.GetScheduleById(req.params.id);
  if(result == null)
  {
    return res.status(404).json({ message: "No schedules found" });
  }
  const obj = convertRow(result.rows[0]);
  return res.json(obj);
  //on error return HTTPSTATUS: NOT FOUND
});

routes.post("/api/schedules", async function (req, res) {
 
    // Querying the client returns a query result promise
    // which is also an asynchronous result iterator.
    const isValid = validateDate(req.body.startTime) && validateDate(req.body.endTime);
    if(!isValid){
        return res.status(400).json("Invalid date format, use this 2022-01-01 00:00:00");
    }
    const startDate: string = req.body.startTime;
    const endDate: string = req.body.endTime;
    const contentId: string = req.body.contentId;
    const client:DBClient = CreateClient();
    const result = await client.AddSchedule(startDate, endDate, contentId);
    return result == null ? res.status(409).json("Could not add schedule") : res.status(201).send();
});

routes.put("/api/schedules/:scheduleId", async function (req, res) {
    const isValid = validateDate(req.body.startTime) && validateDate(req.body.endTime);
    if(!isValid){
        return res.status(400).json("Invalid date format, use this 2022-01-01 00:00:00");
    }
    const scheduleId: string = req.params.scheduleId;
    const startDate: string = req.body.startTime;
    const endDate: string = req.body.endTime;
    const contentId: string = req.body.contentId;
    
    let client:DBClient = CreateClient();
    const exists = await client.GetScheduleById(scheduleId);
    if(exists == null)
    {
      return res.status(404).send("Schedule does not exist");
    }
    client = CreateClient();
    const result = await client.UpdateSchedule(scheduleId,contentId, startDate, endDate);
    
    return result == null ? res.status(404).send("Could not update"): res.status(204).send("Updated successfully");
});

routes.delete("/api/schedules/:scheduleId", async function (req, res) {
    const scheduleId: string = req.params.scheduleId;
    let client:DBClient = CreateClient();
    const exists = await client.GetScheduleById(scheduleId);
    if(exists == null)
    {
      return res.status(404).send("Schedule does not exist");
    }
    client = CreateClient();
    const result = await client.DeleteSchedule(scheduleId);
    return result == null ? res.status(404).send("Could not delete schedule"): res.status(204).send("Deleted successfully");
  });

//routes that use temporal to do CRUD operations start here
routes.get("/temporal-api/schedules", async function (req, res) {
   const result =  await startGetAllSchedulesWorkflow();
   if(result == null)
      return res.status(404).json({ message: "No schedules found" });
   const schedules = convertRows(result.rows);
   return res.json(schedules);
});

routes.post("/temporal-api/schedules", async function (req, res) {
  const isValid = validateDate(req.body.startTime) && validateDate(req.body.endTime);
    if(!isValid){
        return res.status(400).json("Invalid date format, use this 2022-01-01 00:00:00");
    }
  const startDate: string = req.body.startTime;
  const endDate: string = req.body.endTime;
  const contentId: string = req.body.contentId;
  const result = await startAddScheduleWorkflow(startDate, endDate, contentId);
  return result == null ? res.status(409).send("Could not add schedule"): res.status(201).send("Succefssfully added");
});

routes.put("/temporal-api/schedules/:scheduleId", async function (req, res) {
  const isValid = validateDate(req.body.startTime) && validateDate(req.body.endTime);
    if(!isValid){
        return res.status(400).json("Invalid date format, use this 2022-01-01 00:00:00");
    }
  const scheduleId: string = req.params.scheduleId;
  const startDate: string = req.body.startTime;
  const endDate: string = req.body.endTime;
  const contentId: string = req.body.contentId;
  const result = await startUpdateScheduleWorkflow(scheduleId, startDate, endDate, contentId, );
  return result == null? res.status(404).send("Could not update"): res.status(204).send("Updated");
  //TODO test these with postman
});

routes.delete("/temporal-api/schedules/:scheduleId", async function (req, res) {
  const scheduleId: string = req.params.scheduleId;
  const result = await startDeleteScheduleWorkflow(scheduleId);
  return result == null ? res.status(404).send("Could not delete"): res.status(204).send("Deleted");
});

export default routes;


