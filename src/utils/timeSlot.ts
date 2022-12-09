export function getStartTime(intervalInMS: number, now = new Date()): Date {
  return new Date(Math.floor(now.getTime() / intervalInMS) * intervalInMS);
}

export function getEndTime(intervalInMS: number, now = new Date()): Date {
  let dateTime = new Date(
    Math.ceil(now.getTime() / intervalInMS) * intervalInMS
  );
  return subtractSeconds(dateTime, 1);
}

function subtractSeconds(date: Date, seconds: number) {
  date.setSeconds(date.getSeconds() - seconds);
  return date;
}
