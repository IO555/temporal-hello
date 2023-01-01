
export function validateDate(date:string):boolean{
    const dateRegex = /\d{4}-\d{2}-\d{2}\s*\d{2}:\d{2}:\d{2}/;
    const result = dateRegex.test(date);
    return result;
}