
import { Router } from "express";
import { nextTick } from "process";
import {
  startWorkflow,
  startSubscriptionWorkflow,
  cancelSubscriptionWorkflow,
} from "./client";
import { cancelSubscription, scheduleWorkflow } from "./workflows";
import { Client, Query } from "ts-postgres";

const routes = Router();

function CreateClient(): Client {
  const client = new Client({
    host: "localhost",
    port: 54320,
    user: "user",
    password: "password",
    database: "content",
  });
  return client;
}

function ReplacePlaceholders(str:string, ...params:any[]) {
    for(const param of params)
      str = str.replace("%", param);
     return str;
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
  const client = CreateClient();
  try {
    await client.connect();
    const query = "SELECT * FROM GetAllSchedulesFunc();";
    const result = client.query(query);

    for await (const row of result) {
      console.log(row.data);
    }
    return res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
});

routes.post("/api/schedules", async function (req, res) {
  const client = CreateClient();
  try {
    // Querying the client returns a query result promise
    // which is also an asynchronous result iterator.
    const startDate: string = req.body.startTime;
    const endDate: string = req.body.endTime;
    const contentId: string = req.body.contentId;
    await client.connect();
    const query:string = ReplacePlaceholders("CALL AddSchedule( null, '%', '%', '%');", contentId, startDate, endDate);
    const result = client.query(query);

    for await (const row of result) {
      console.log(row.data);
    }
    return res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
});

routes.put("/api/schedules/:scheduleId", async function (req, res) {
  const client = CreateClient();
  try {
    const scheduleId: string = req.params.scheduleId;
    const startDate: string = req.body.startTime;
    const endDate: string = req.body.endTime;
    const contentId: string = req.body.contentId;
    await client.connect();
    const query = ReplacePlaceholders("CALL UpdateSchedule('%', '%', '%', '%');", scheduleId, contentId, startDate, endDate);
    console.log(query);
    const result = client.query(query);

    for await (const row of result) {
      console.log(row.data);
    }
    return res.json({ message: "Successfully updated a schedule" });
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
});

routes.delete("/api/schedules/:scheduleId", async function (req, res) {
    const client = CreateClient();
    try {
      const scheduleId: string = req.params.scheduleId;
      await client.connect();
      const query = ReplacePlaceholders("CALL DeleteSchedule('%');", scheduleId);
      console.log(query);
      const result = client.query(query);
  
      for await (const row of result) {
        console.log(row.data);
      }
      return res.json({ message: "Successfully deleted a schedule" });
    } catch (err) {
      console.log(err);
    } finally {
      await client.end();
    }
  });

export default routes;
