// @@@SNIPSTART typescript-hello-workflow
import { sleep, proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

import * as wf from '@temporalio/workflow';

//import type { saveScheduleToDB, getAllSchedules } from './activities';
import { ResultIterator } from 'ts-postgres';

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
  return await greet(name);
}
// @@@SNIPEND

const { sendWelcomeEmail, sendSubscriptionOverEmail, sendCancelSubscriptionEmail } = proxyActivities<
  typeof activities>({
  startToCloseTimeout: '1 minute',
});

const { saveScheduleToDB, getAllSchedules, AddSchedule, DeleteSchedule, UpdateSchedule, GetScheduleById, GetScheduleByContentId} = proxyActivities<
  typeof activities>({startToCloseTimeout: '10 seconds'});

export const cancelSubscription = wf.defineSignal('cancelSignal');

export async function SubscriptionWorkflow(
  email: string,
  trialPeriod: string | number
) {
  // internal variable to track cancel state
  let isCanceled = false;
  wf.setHandler(cancelSubscription, () => void (isCanceled = true));
  await sendWelcomeEmail(email);
  await sleep(trialPeriod);
  if (isCanceled) {
    await sendCancelSubscriptionEmail();
  } else {
    await sendSubscriptionOverEmail(email);
  }
}

export async function scheduleWorkflow(
  beginDate: string,
  endDate: string
): Promise<string> 
{
    const result = await saveScheduleToDB(beginDate, endDate);
    return result;
}

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




