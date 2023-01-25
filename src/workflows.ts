// @@@SNIPSTART typescript-hello-workflow
import { sleep, proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

import * as wf from '@temporalio/workflow';

//import type { saveScheduleToDB, getAllSchedules } from './activities';
import { ResultIterator } from 'ts-postgres';



const { getAllSchedules, AddSchedule, DeleteSchedule, UpdateSchedule, GetScheduleById, GetScheduleByContentId,
  GetSchedulesBetweenDates} = proxyActivities<
  typeof activities>({startToCloseTimeout: '10 seconds'});



export async function getAllSchedulesWorkflow():Promise<ResultIterator | null>
{
  return await getAllSchedules();
}

export async function addScheduleWorkflow(startDate:string, endDate:string, contentId:string):Promise<ResultIterator | null>
{
  return await AddSchedule(startDate, endDate, contentId);
}

export async function deleteScheduleWorkflow(scheduleId:string):Promise<ResultIterator | null>
{
  return await DeleteSchedule(scheduleId);
}

export async function updateScheduleWorkflow(scheduleId:string, startDate:string, endDate:string, contentId:string):Promise<ResultIterator | null>
{
  return await UpdateSchedule(scheduleId, startDate, endDate, contentId);
}

export async function GetScheduleByContentIdWorkflow(contentId:string):Promise<ResultIterator | null>
{
  return await GetScheduleByContentId(contentId);
}

export async function GetScheduleByIdWorkflow(scheduleId:string):Promise<ResultIterator | null>
{
  return await GetScheduleById(scheduleId);
}

export async function GetSchedulesBetweenDatesWorkflow(startDate:string, endDate:string):Promise<ResultIterator | null>
{
  return await GetSchedulesBetweenDates(startDate, endDate);
}




