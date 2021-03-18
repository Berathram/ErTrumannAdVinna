const originDate = new Date(2021, 2, 2);
const sectionLength = 4;
const scheduleLength = sectionLength * 6;
const dayInMilli = 1000 * 60 * 60 * 24;
const hourInMilli = 1000 * 60 * 60;
const schedule = [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0];

/**
 * Finds the next work day from a given day
 *
 * @param {Date} day A day to check
 * @return {Date} next work date
 */
function getNextWork(day) {
  const currentLoc = getScheduleLoc(day);
  let foo = schedule.indexOf(1, (currentLoc + 1) % scheduleLength);
  if (foo === -1) {
    foo = schedule.indexOf(1) + scheduleLength;
  }
  let bar = schedule.indexOf(2, (currentLoc + 1) % scheduleLength);
  if (bar === -1) {
    bar = schedule.indexOf(2) + scheduleLength;
  }
  const nextLoc = Math.min(foo, bar);
  const nextWork = new Date(day.getTime());
  nextWork.setDate(nextWork.getDate() + nextLoc - currentLoc);
  nextWork.setHours(0, 0, 0, 0);
  return nextWork;
}

/**
 * Finds the next vaction day from a given day
 *
 * @param {Date} day A day to check
 * @return {Date} next vacation date
 */
function getNextVacation(day) {
  const currentLoc = getScheduleLoc(day);
  let nextLoc = schedule.indexOf(0, (currentLoc + 1) % scheduleLength);
  if (nextLoc === -1) {
    nextLoc = schedule.indexOf(0) + scheduleLength;
  }
  const nextVac = new Date(day.getTime());
  nextVac.setDate(nextVac.getDate() + nextLoc - currentLoc);
  nextVac.setHours(0, 0, 0, 0);
  return nextVac;
}

/**
 * Finds where a day is in terms of schedule
 *
 * @param {Date} day A day to check
 * @return {int} position Zero based position in schedule
 */
function getScheduleLoc(day) {
  const diff = (day - originDate) / dayInMilli;
  return Math.floor(diff) % scheduleLength;
}

/**
 * Finds what type of work day it is at a certain date
 *
 * @param {Date} day A day to check
 * @return {int} 0:vaction, 1:day, 2:night
 */
function getDayType(day) {
  const loc = getScheduleLoc(day);
  return schedule[loc];
}

/**
 * Returns wether is working or not
 *
 * @param {Date} day A day to check
 * @return {Boolean} true if working, false otherwise
 */
function isWorking(day) {
  const today = new Date(day.getTime());
  const yesterday = new Date(day.getTime());
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(day.getTime());
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayType = getDayType(day);
  const yesterdayType = getDayType(yesterday);
  const tomorrowType = getDayType(tomorrow);
  // Today with 0 hours, minutes, seconds and milliseconds
  const todate = new Date(day.getTime());
  todate.setHours(0, 0, 0, 0);
  const hoursOfDay = (today - todate) / hourInMilli;

  if (dayType === 0 && yesterdayType !== 2 && tomorrowType !== 2) {
    return false;
  }
  if (dayType === 0 && yesterdayType === 2) {
    if (hoursOfDay < 7.5) {
      return true;
    }
    return false;
  }
  if (dayType === 1) {
    if (hoursOfDay >= 7.5 && hoursOfDay < 19.5) {
      return true;
    }
    return false;
  }
  if (dayType === 2 && yesterdayType === 0) {
    if (hoursOfDay >= 19.5) {
      return true;
    }
    return false;
  }
  if (dayType === 2 && yesterdayType !== 0) {
    if (hoursOfDay < 7.5 || hoursOfDay >= 19.5) {
      return true;
    }
    return false;
  }
  return false;
}

export {
  getDayType, getNextVacation, getNextWork, isWorking,
};
