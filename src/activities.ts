import { Client } from "ts-postgres";

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

export async function saveScheduleToDB(
  beginDate: string,
  endDate: string
): Promise<void> {
  const client = new Client({
    host: "127.0.0.1",
    port: 54320,
    user: "user",
    password: "password",
    database: "content",
  });
  await client.connect();
  

  console.log(`Saving schedule to DB begin: ` + beginDate + " end: " + endDate);
}
