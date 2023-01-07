
export function convertRows(rows:any[][]):object[] {
    const schedules = [];
    for (let i = 0; i < rows.length; i++) {
      const schedule = convertRow(rows[i]);
      schedules.push(schedule);
    }
    return schedules;
  }

export function convertRow(row:any):object {
    return { id: row[0], contentId: row[1], startTime: row[2], endTime: row[3] };
  }