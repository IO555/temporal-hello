

import express, { Express, Request, Response } from 'express';
import app from './app';

app.locals.needed = "this is a global variable named needed";

app.listen(8090);



 

 //server.close()