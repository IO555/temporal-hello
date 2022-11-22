// @@@SNIPSTART typescript-hello-activity
export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}
// @@@SNIPEND

export async function sendWelcomeEmail(email: string): Promise<void> {
  console.log(`Sending welcome email to ${email}`);
}

export async function sendSubscriptionOverEmail(email: string): Promise<void> {
  console.log(`Sending subscription over email to ${email}`);
}

export async function sendCancelSubscriptionEmail(): Promise<void> {
  console.log(`Sending Subscription canceled email`);
}
