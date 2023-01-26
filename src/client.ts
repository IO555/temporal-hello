// @@@SNIPSTART typescript-hello-client
import { Connection, WorkflowClient } from '@temporalio/client';
import { nanoid } from 'nanoid';
import { getAllSchedulesWorkflow, updateScheduleWorkflow, deleteScheduleWorkflow, addScheduleWorkflow, GetScheduleByIdWorkflow, GetSchedulesBetweenByContentIdWorkflow,
         GetSchedulesBetweenDatesWorkflow, GetSchedulesByContentIdWorkflow } from './workflows';
import { ResultIterator } from 'ts-postgres';
import { WorkflowFailedError } from '@temporalio/client';

  
  export async function startGetScheduleByIdWorkflow(id:string):Promise<ResultIterator |null>{
    const connection = await Connection.connect();
    const client = new WorkflowClient({connection});
    const handle = await client.start(GetScheduleByIdWorkflow,  {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args:[id],
      workflowRunTimeout:'10 seconds'
  });
    const result = await handle.result();
    return result;
  }
  
  export async function startGetSchedulesByContentIdWorkflow(cid:string): Promise<ResultIterator |null>{
    const connection = await Connection.connect();
    const client = new WorkflowClient({connection});
    const handle = await client.start(GetSchedulesByContentIdWorkflow,  {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args:[cid],
      workflowRunTimeout:'10 seconds'
    });
    const result = await handle.result();
    return result;
  }

  export async function startGetAllSchedulesWorkflow():Promise<ResultIterator |null>{
    const connection = await Connection.connect();
    const client = new WorkflowClient({connection});
    const handle = await client.start(getAllSchedulesWorkflow,  {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args:[],
      workflowRunTimeout:'10 seconds'
    });
      const result = await handle.result();
      return result;
    }

  export async function startUpdateScheduleWorkflow(id:string, beginDate:string, endDate:string, contentId:string):Promise<ResultIterator |null>{
    const connection = await Connection.connect();
    const client = new WorkflowClient({connection});
    const handle = await client.start(updateScheduleWorkflow,  {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args:[id, beginDate, endDate, contentId],
      workflowRunTimeout:'10 seconds'
    });
    const result = await handle.result();
    return result;
  }

  export async function startDeleteScheduleWorkflow(id:string):Promise<ResultIterator |null>{
    const connection = await Connection.connect();
    const client = new WorkflowClient({connection});
    const handle = await client.start(deleteScheduleWorkflow,  {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args:[id],
      workflowRunTimeout:'10 seconds'
    });
    const result = await handle.result();
    return result;
  }

  export async function startAddScheduleWorkflow(startDate:string, endDate:string, contentID:string)
  {
    const connection = await Connection.connect();
    const client = new WorkflowClient({connection});
    const handle = await client.start(addScheduleWorkflow,  {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args:[startDate, endDate, contentID],
      workflowRunTimeout:'10 seconds'
    });
    const result = await handle.result();
    return result;
  }

  export async function startGetSchedulesBetweenByContentIdWorkflow(contentId:string, startDate:string, endDate:string):Promise<ResultIterator |null>{
    const connection = await Connection.connect();
    const client = new WorkflowClient({connection});
    const handle = await client.start(GetSchedulesBetweenByContentIdWorkflow,  {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args:[contentId, startDate, endDate],
      workflowRunTimeout:'10 seconds'
  });
    const result = await handle.result();
    return result;
  }

  export async function startGetSchedulesBetweenDatesWorkflow(beginDate:string, endDate:string):Promise<ResultIterator |null>{
    const connection = await Connection.connect();
    const client = new WorkflowClient({connection});
    const handle = await client.start(GetSchedulesBetweenDatesWorkflow,  {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args:[beginDate, endDate],
      workflowRunTimeout:'10 seconds'
  });
    const result = await handle.result();
    return result;
  }


// @@@SNIPEND
