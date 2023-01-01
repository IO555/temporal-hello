import { Client, Query, Configuration, ResultIterator } from "ts-postgres";
//import { ResultIterator } from "ts-postgres/dist/src/result";

export class DBClient {
  private client: Client;
  constructor(DBConfig: Configuration) {
    this.client = new Client(DBConfig);
  }
  public async GetAllSchedules(): Promise<ResultIterator | null> {
    let result = null;
    await this.client.connect();
    try {
      const query = "SELECT * FROM GetAllSchedulesFunc();";
      result = this.client.query(query);
    } catch (error) {
      console.log(error);
      return result;
    } finally {
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
    } catch (error) {
      console.log(error);
      return null;
    } finally {
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
    await this.client.connect();
    let result = null;
    try {
      const query: string = this.ReplacePlaceholders(
        "CALL UpdateSchedule('%', '%', '%', '%');",
        scheduleId,
        contentId,
        startDate,
        endDate
      );
      result = await this.client.query(query);
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      await this.client.end();
    }
    
    return result;
  }
  
  public async DeleteSchedule(
    scheduleId: string
  ): Promise<ResultIterator | null> {
    await this.client.connect();
    let result = null;
    try {
      const query: string = this.ReplacePlaceholders(
        "CALL DeleteSchedule('%');",
        scheduleId
      );
      result = await this.client.query(query);
    } catch (error) {
      console.log(error);
      return result;
    } finally {
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
       //console.log(result);
    }
    catch(error){
      console.log(error);
      return null;
    }
    finally{
      await this.client.end();
    }
    if(result.status == 'SELECT 0')
    {
      return null;
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
