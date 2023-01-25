import { Client, Configuration, ResultIterator } from "ts-postgres";
//import { ResultIterator } from "ts-postgres/dist/src/result";

//DBClient represents a database client that can be used to execute queries against the database.
//DBClient returns null if UpdateSchedule did not affect any rows
//DBClient returns null if DeleteSchedule did not affect any rows
//DBClient returns null if GetScheduleById did not return anything


export class DBClient {
  private client: Client;
  constructor(DBConfig: Configuration) {
    this.client = new Client(DBConfig);
  }
  public async GetAllSchedules(): Promise<ResultIterator | null> {
    let result = null;
    
    try {
      await this.client.connect();
      const query = "SELECT * FROM GetAllSchedulesFunc();";
      result = this.client.query(query);
    }
    finally {
      await this.client.end();
    }
    return result;
  }

  public async AddSchedule(
    startDate: string,
    endDate: string,
    contentId: string
  ): Promise<ResultIterator | null> {
    await this.client.connect();
    let result = null;
    try {
      const query: string = this.ReplacePlaceholders(
        "CALL AddSchedule( null, '%', '%', '%');",
        contentId,
        startDate,
        endDate
      );
      //Waiting on the result (i.e., result iterator) returns the complete query result.
      result = await this.client.query(query);
      if(result?.rows[0][0] == 0)
      {
          result = null;
      }
    }
    finally {
      await this.client.end();
    }
    return result;
  }

  public async UpdateSchedule(
    scheduleId: string,
    contentId: string,
    startDate: string,
    endDate: string
  ): Promise<ResultIterator | null> {
    
    let result = null;
    try {
      await this.client.connect();
      const query: string = this.ReplacePlaceholders(
        "CALL UpdateSchedule('%', '%', '%', '%', null);",
        scheduleId,
        contentId,
        startDate,
        endDate
      );
      result = await this.client.query(query);
      if(result?.rows[0][0] == 0)
      {
        result = null;
      }
    }
    finally {
      await this.client.end();
    }
    
    return result;
  }
  
  public async DeleteSchedule(
    scheduleId: string
  ): Promise<ResultIterator | null> {
    
    let result = null;
    try {
      await this.client.connect();
      const query: string = this.ReplacePlaceholders(
        "CALL DeleteSchedule('%', null);",
        scheduleId
      );
      result = await this.client.query(query);
      if(result?.rows[0][0] == 0)
      {
           result = null;
      }
    } 
    finally {
      await this.client.end();
    }
    return result;
  }

  public async GetScheduleById(id: string) {
    const query = this.ReplacePlaceholders("SELECT * FROM GetScheduleByIdFunc(%);", id);
    let result = null;
    try{
       await this.client.connect();
       result = await this.client.query(query);
    }
    finally{
      await this.client.end();
    }
    if(result.status == 'SELECT 0')
    {
      result = null;
    }
    return result;
  }

  public async GetScheduleByContentId(id: string, startDate:string, endDate:string) {
    const query = this.ReplacePlaceholders("SELECT * FROM GetScheduleByContentIdFunc(%, '%', '%');", id, startDate, endDate);
    let result = null;
    try{
      await this.client.connect();
       result = await this.client.query(query);
    }
    finally{
      await this.client.end();
    }
    if(result.status == 'SELECT 0')
    {
      result = null;
    }
    return result;
  }

  public async GetSchedulesBetweenDates(startDate: string, endDate: string) {
      const query = this.ReplacePlaceholders("SELECT * FROM GetScheduleBetweenDatesFunc('%', '%');", startDate, endDate);
      console.log(query);
      let result = null;
      try {
          await this.client.connect();
          result = await this.client.query(query);
      }
      finally {
          await this.client.end();
      }
      return result;
  }
  

  private ReplacePlaceholders(str: string, ...params: any[]) {
    for (const param of params) str = str.replace("%", param);
    return str;
  }
}

export class DBConfig implements Configuration {
  constructor(
    host: string,
    port: number,
    user: string,
    password: string,
    database: string
  ) {
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.database = database;
  }
  public host: string;
  public port: number;
  public user: string;
  public password: string;
  public database: string;
}
