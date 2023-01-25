import { Client, ResultIterator } from "ts-postgres";
import {DBClient, DBConfig} from "./DBClient";

// @@@SNIPSTART typescript-hello-activity
export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}
// @@@SNIPEND



function CreateClient(): DBClient {
  const config:DBConfig = new DBConfig("localhost",54320,"user","password","content");
  return new DBClient(config);
}

export async function getAllSchedules(): Promise<ResultIterator |null> {
  const client:DBClient = CreateClient();
  const result = await client.GetAllSchedules();
  console.log("got to activity getAllSchedules");
  return result;
}

export async function AddSchedule(startDate:string, endDate:string, contentId:string): Promise<ResultIterator |null>{
  const client:DBClient = CreateClient();
  const result = await client.AddSchedule(startDate, endDate, contentId);
  return result;
}

export async function DeleteSchedule(scheduleId:string): Promise<ResultIterator |null>{
  const client:DBClient = CreateClient();
  const result = await client.DeleteSchedule(scheduleId);
  return result;
}

export async function UpdateSchedule(scheduleId:string, startDate:string, endDate:string, contentId:string): Promise<ResultIterator |null>{
  const client:DBClient = CreateClient();
  const result = await client.UpdateSchedule(scheduleId, contentId, startDate, endDate );
  return result;
}

export async function GetScheduleByContentId(contentId:string): Promise<ResultIterator |null>{
  const client:DBClient = CreateClient();
  const result = await client.GetScheduleByContentId(contentId);
  return result;
}

export async function GetScheduleById(scheduleId:string): Promise<ResultIterator |null>{
  const client:DBClient = CreateClient();
  const result = await client.GetScheduleById(scheduleId);
  return result;
}

export async function GetSchedulesBetweenDates(startDate:string, endDate:string): Promise<ResultIterator |null>{
  console.log("here @activity")
  const client:DBClient = CreateClient();
  const result = await client.GetSchedulesBetweenDates(startDate, endDate);
  return result;
}


