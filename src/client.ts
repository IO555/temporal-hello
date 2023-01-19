// @@@SNIPSTART typescript-hello-client
import { Connection, WorkflowClient } from '@temporalio/client';
import { example } from './workflows';
import { nanoid } from 'nanoid';
import { SubscriptionWorkflow, cancelSubscription,scheduleWorkflow, getAllSchedulesWorkflow, 
  updateScheduleWorkflow, deleteScheduleWorkflow, addScheduleWorkflow, GetScheduleByIdWorkflow } from './workflows';
import { ResultIterator } from 'ts-postgres';
import { WorkflowFailedError } from '@temporalio/client';

export default async function run(param:string) {
  // Connect to the default Server location (localhost:7233)
  const connection = await Connection.connect();
  // In production, pass options to configure TLS and other settings:
  // {
  //   address: 'foo.bar.tmprl.cloud',
  //   tls: {}
  // }

  const client = new WorkflowClient({
    connection,
    // namespace: 'foo.bar', // connects to 'default' namespace if not specified
  });

  const handle = await client.start(example, {
    // type inference works! args: [name: string]
    args: [param],
    taskQueue: 'hello-world',
    // in practice, use a meaningful business id, eg customerId or transactionId
    workflowId: 'workflow-' + nanoid(),
    /*cronSchedule: "0/15 * * * *", */
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  console.log(await handle.result()); // Hello, Temporal!
}

  export function startWorkflow(param:string) {
  run(param).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  };

  export async function cancelSubscriptionWorkflow() {
      const connection = await Connection.connect();
      const client = new WorkflowClient({
        connection,
      });
      const handle = client.getHandle('business-meaningful-id'); // match the Workflow id
       await handle.signal(cancelSubscription);
  }

  export async function startSubscriptionWorkflow(){
    const connection = await Connection.connect();
      const client = new WorkflowClient({
        connection,
      });
    const result = await client.start(SubscriptionWorkflow, {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args: ['foo@bar.com', '15 seconds'],
    });
  }
  export async function startScheduleWorkflow(beginDate:string, endDate:string):Promise<string>{
    const connection = await Connection.connect();
      const client = new WorkflowClient({
        connection,
      });
    const handle = await client.start(scheduleWorkflow, {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args: [beginDate, endDate],
    });
    const result = await handle.result();
    console.log("result: " + result+ " We have a result @client");
    return result;
  }
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
  export async function startGetAllSchedulesWorkflow():Promise<ResultIterator |null>{
    const connection = await Connection.connect();
    const client = new WorkflowClient({connection});
    const handle = await client.start(getAllSchedulesWorkflow,  {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args:[],
      workflowRunTimeout:'10 seconds'
    });
    try{
      const result = await handle.result();
      return result;
    }
    catch(err)
    {
      if(err instanceof WorkflowFailedError)
      {
        throw new Error('Temporal workflow failed: ' + err.message);
      }
      else
      {
        throw new Error('Error from temporal workflow: ' + err);
      }
    }
    
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




// @@@SNIPEND
