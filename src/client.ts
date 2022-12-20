// @@@SNIPSTART typescript-hello-client
import { Connection, WorkflowClient } from '@temporalio/client';
import { example } from './workflows';
import { nanoid } from 'nanoid';
import { SubscriptionWorkflow, cancelSubscription,scheduleWorkflow, getAllSchedulesWorkflow } from './workflows';
import { ResultIterator } from 'ts-postgres';

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

  export async function startGetAllSchedulesWorkflow():Promise<ResultIterator |null>{
    const connection = await Connection.connect();
    const client = new WorkflowClient({connection});
    console.log("got to client");
    const handle = await client.start(getAllSchedulesWorkflow,  {
      workflowId: 'business-meaningful-id',
      taskQueue: 'tutorial',
      args:[],
    });
    const result = await handle.result();
    console.log("result: " + result+ " We have a result @client");
    return result;
  }




// @@@SNIPEND
