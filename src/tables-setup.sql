CREATE TABLE Content(
	ContentID SERIAL NOT NULL,
	ContentName VARCHAR(255),
	PRIMARY KEY (ContentID)
);
CREATE TABLE Schedule(
    ScheduleID SERIAL NOT NULL,
    ContentID int,
    StartTime timestamp,
    EndTime timestamp,
    PRIMARY KEY (ScheduleID),
    FOREIGN KEY (ContentID) REFERENCES Content(ContentID) ON UPDATE CASCADE
);

CREATE PROCEDURE AddContent(c_ID INOUT INT, c_Name VARCHAR(255))
LANGUAGE plpgsql AS
$$ BEGIN
INSERT INTO Content(ContentName)
VALUES (c_Name) RETURNING ContentID INTO c_ID;
END $$;

--CALL AddContent(NULL, 'Test Content');

CREATE PROCEDURE AddSchedule(s_ID INOUT INT, c_ID INT ,  s_StartTime TimeStamp,  s_EndTime TimeStamp)
LANGUAGE plpgsql AS

$$ BEGIN
INSERT INTO Schedule(ContentID, StartTime, EndTime)
VALUES(c_ID, s_StartTime, s_EndTime) RETURNING ScheduleID INTO s_ID;
END $$;

--CALL AddSchedule(NULL, 1, '2001-01-10 08:00:00', '2002-10-10 09:00:00');



CREATE OR REPLACE PROCEDURE UpdateSchedule(
    IN s_id int,
    IN c_id int,
	IN start_time timestamp,
	in end_time timestamp,
    OUT affectedrows int)
LANGUAGE 'plpgsql'
AS $$
BEGIN

    UPDATE Schedule SET 
	ContentID = c_id,
	StartTime = start_time,
	EndTime = end_time
	WHERE ScheduleID = s_id;
    GET DIAGNOSTICS affectedrows := ROW_COUNT;

END
$$;
/*CALL UpdateSchedule(44, 1, '2022-10-11 10:00:59', '2022-10-23 10:00:00', null);*/

CREATE PROCEDURE DeleteSchedule(IN s_ID int, OUT affectedrows int)

LANGUAGE plpgsql AS $$ 

BEGIN
DELETE FROM Schedule WHERE ScheduleID = s_ID;
GET DIAGNOSTICS affectedrows := ROW_COUNT;
END $$


CREATE OR REPLACE FUNCTION GetAllSchedulesFunc() RETURNS TABLE(ScheduleID int, ContentID int, StartTime timestamp,
														 EndTime timestamp)
language plpgsql
as $$
begin
RETURN QUERY SELECT * FROM Schedule;

end$$;

CREATE OR REPLACE FUNCTION GetScheduleByIdFunc(s_ID int) RETURNS TABLE(sch_ID int, ContentID int, StartTime timestamp,
                                                         EndTime timestamp)
language plpgsql
as $$
begin
RETURN QUERY SELECT * FROM schedule WHERE scheduleID = s_ID;

end$$;

CREATE OR REPLACE FUNCTION GetScheduleBetweenDatesFunc(s_StartTime text, s_EndTime text) RETURNS TABLE(sch_ID int, r_ContentID int, r_StartTime timestamp,
                                                         r_EndTime timestamp)
language plpgsql
as $$
begin
RETURN QUERY SELECT * FROM schedule WHERE startTime >= TO_TIMESTAMP(s_StartTime, 'YYYY-MM-DD HH24:MI:SS') AND endTime <= TO_TIMESTAMP(s_EndTime,
  'YYYY-MM-DD HH24:MI:SS');

end$$

CREATE OR REPLACE FUNCTION GetScheduleByContentIdFunc(c_ID int, s_StartTime text, s_EndTime text) RETURNS TABLE(sch_ID int, r_ContentID int, r_StartTime timestamp,
                                                         r_EndTime timestamp)
language plpgsql
as $$
begin
RETURN QUERY SELECT * FROM schedule WHERE contentID = c_ID AND startTime >= TO_TIMESTAMP(s_StartTime, 'YYYY-MM-DD HH24:MI:SS') AND endTime <= TO_TIMESTAMP(s_EndTime,
  'YYYY-MM-DD HH24:MI:SS');

end$$


