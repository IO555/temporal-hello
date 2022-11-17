import HTTP from "http";
import { ServerResponse, IncomingMessage } from "http";
import run from "./client";

const server = HTTP.createServer((req, res) => {
    // get tasks
    if (req.method == "POST" && req.url == "/api/start-workflow") {
      return startWorkflow(req, res);
    }
 });

server.listen(3000, () => {
    console.log('Server is running on port 3000. Go to http://localhost:3000/api/start-workflow');
 });
 
 const startWorkflow = (req: IncomingMessage, res: ServerResponse) => {
    run().catch((err) => {
        console.error(err);
        process.exit(1);
      });
    return res.end('Started workflow');
 };

 //server.close()