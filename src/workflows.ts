// @@@SNIPSTART typescript-hello-workflow
import { sleep, proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

import * as wf from '@temporalio/workflow';

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



