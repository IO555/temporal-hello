
import { Router } from "express";
import { nextTick } from "process";
import { validateDate } from "./validate-params";
import { convertRow, convertRows } from "./dataTypeConverter";
import {
  startGetAllSchedulesWorkflow,
  startAddScheduleWorkflow,
  startUpdateScheduleWorkflow,
  startDeleteScheduleWorkflow,
  startGetScheduleByIdWorkflow,
  startGetSchedulesBetweenDatesWorkflow,
  startGetScheduleByContentIdWorkflow
} from "./client";
import {DBClient, DBConfig} from "./DBClient";

const routes = Router();

function CreateClient(): DBClient {
  const config:DBConfig = new DBConfig("localhost",54320,"user","password","content");
  return new DBClient(config);
}


//API functions that DO NOT use temporal start here---------------------------------------------------------

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
  const client:DBClient = CreateClient();
  const result = await client.GetScheduleById(req.params.id);
  if(result == null)
  {
    return res.status(404).json({ message: "No schedules found" });
  }
  const obj = convertRow(result.rows[0]);
  return res.json(obj);
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
    
    const client:DBClient = CreateClient();
    
    const result = await client.UpdateSchedule(scheduleId,contentId, startDate, endDate);
    
    console.log(result?.rows[0][0]);
    if(result?.rows[0][0] == 0)
    {
      return res.status(404).send("Schedule does not exist");
    }
    
    return result == null ? res.status(404).send("Could not update"): res.status(204).send("Updated successfully");
});

routes.delete("/api/schedules/:scheduleId", async function (req, res) {
    const scheduleId: string = req.params.scheduleId;
    const client:DBClient = CreateClient();
    const result = await client.DeleteSchedule(scheduleId);
    if(result?.rows[0][0] == 0)
    {
      return res.status(404).send("Schedule does not exist");
    }
    return result == null ? res.status(404).send("Could not delete schedule"): res.status(204).send("Deleted successfully");
  });

//routes that use temporal workflows start here
//---------------------------------------------------------------------------------------------------------------------------
routes.get("/temporal-api/schedules/:scheduleId", async function (req, res) {
  const result = await startGetScheduleByIdWorkflow(req.params.scheduleId);
  if(result == null)
  {
    return res.status(404).json({ message: "No schedules found" });
  }
  const obj = convertRow(result.rows[0]);
  return res.json(obj);
});


routes.get("/temporal-api/schedules/", async function (req, res) {
  let result = null;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  const contentID = req.query.contentID;
    if(startTime == null  && endTime != null)
    {
      return res.status(400).json('Please provide both startTime and endTime');
    }
    if(startTime != null && endTime == null)
    {
      return res.status(400).json('Please provide both startTime and endTime');
    }
    else if(startTime != null && endTime != null && contentID == null)
    {
      result = await startGetSchedulesBetweenDatesWorkflow(startTime.toString(), endTime.toString());
    }
    else if(startTime != null && endTime != null && contentID != null)
    {
      result = await startGetScheduleByContentIdWorkflow(contentID.toString(), startTime.toString(), endTime.toString());
    }
    
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
  return result == null ? res.status(409).send("Could not add schedule"): res.status(201).send("Successfully added");
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
});

routes.delete("/temporal-api/schedules/:scheduleId", async function (req, res) {
  const scheduleId: string = req.params.scheduleId;
  const result = await startDeleteScheduleWorkflow(scheduleId);
  
  return result == null ? res.status(404).send("Could not delete"): res.status(204).send("Deleted");
});



export default routes;


