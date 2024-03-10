import { calender } from "./data_store";
export default (time, time2, type) => {
  //type == "date" | "time" | "diff" | "format"
  const { months } = calender;

  const timer = new Date(time);
  const timer2 = new Date(time2);
  const currentTimer = new Date();

  const tHr = timer.getHours();
  const tMin = timer.getMinutes();
  const tMonth = timer.getMonth();
  const tDay = timer.getDate();
  const tYear = timer.getFullYear();
  //
  // const currHr = currentTimer.getHours();
  // const currMin = currentTimer.getMinutes();
  const currMonth = currentTimer.getMonth();
  const currDay = currentTimer.getDate();
  const currYear = currentTimer.getFullYear();

  let hr, min, post;

  if (type && type == "date") {
    return `${tDay}/${months[tMonth].short}/${tYear}`;
  }

  if (type && type === "format") {
    let timerValue;
    const timerSecs = (timer - Date.now()) / 1000;
    if (timerSecs >= 604800) {
      const num = Math.ceil(timerSecs / 604800);
      timerValue = {
        short: `${num}w`,
        full: `${num} weeks`,
        mid: `${num} wks`,
      };
    } else if (timerSecs >= 86400) {
      const num = Math.ceil(timerSecs / 86400);
      timerValue = {
        short: `${num}d`,
        full: `${num} days`,
        mid: `${num} dys`,
      };
    } else if (timerSecs >= 3600) {
      const num = Math.ceil(timerSecs / 3600);
      timerValue = {
        short: `${num}h`,
        full: `${num} hours`,
        mid: `${num} hrs`,
      };
    } else if (timerSecs >= 60) {
      const num = Math.ceil(timerSecs / 60);
      timerValue = {
        short: `${num}m`,
        full: `${num} minutes`,
        mid: `${num} min`,
      };
    } else if (timerSecs < 60) {
      const num = Math.abs(Math.ceil(timerSecs / 60));
      timerValue = {
        short: `now`,
        full: `${num} seconds`,
        mid: `${num} sec`,
      };
    }
    return timerValue;
  }
  if (type && type === "format_raw") {
    let timerValue;
    const timerSecs = time / 1000;
    if (timerSecs >= 604800) {
      const num = Math.ceil(timerSecs / 604800);
      timerValue = {
        short: `${num}w`,
        full: `${num} weeks`,
        mid: `${num} wks`,
        data: num,
        expired: false,
      };
    } else if (timerSecs >= 86400) {
      const num = Math.ceil(timerSecs / 86400);
      timerValue = {
        short: `${num}d`,
        full: `${num} days`,
        mid: `${num} dys`,
        data: num,
        expired: false,
      };
    } else if (timerSecs >= 3600) {
      const num = Math.ceil(timerSecs / 3600);
      timerValue = {
        short: `${num}h`,
        full: `${num} hours`,
        mid: `${num} hrs`,
        data: num,
        expired: false,
      };
    } else if (timerSecs >= 60) {
      const num = Math.ceil(timerSecs / 60);
      timerValue = {
        short: `${num}m`,
        full: `${num} minutes`,
        mid: `${num} min`,
        data: num,
        expired: false,
      };
    } else if (timerSecs < 60) {
      const num = Math.abs(Math.ceil(timerSecs / 60));
      timerValue = {
        short: `now`,
        full: `${num} seconds`,
        mid: `${num} sec`,
        data: num,
        expired: true,
      };
    }
    return timerValue;
  }

  if (type && type === "event") {
    const diff = (timer - currentTimer) / 1000;
    const tomorrowChecker =
      currYear === tYear && currMonth === tMonth && tDay - currDay == 1;
    const todayChecker =
      currYear === tYear && currMonth === tMonth && tDay - currDay == 0;

    if (tHr > 12) {
      hr = tHr % 12;
      post = "PM";
    } else if (tHr === 0) {
      hr = 12;
      post = "PM";
    } else {
      hr = tHr;
      post = "AM";
    }

    if (tMin < 10) {
      min = `0${tMin}`;
    } else {
      min = tMin;
    }

    if (todayChecker) {
      return `Today by ${hr}:${min} ${post}`;
    } else if (tomorrowChecker) {
      return `Tomorrow by ${hr}:${min} ${post}`;
    } else if (diff > 86400) {
      return `In ${Math.round(diff / 86400)} days`;
    } else if (diff < 0) {
      return null;
    }
  }

  if (type === "diff") {
    const diff = Math.abs((timer - timer2) / 1000);
    return diff > 60;
  }

  if (time && time2) {
    const diff = (timer - timer2) / 1000;
    if (diff >= 86400) {
      if (diff / 86400 > 2) {
        return `${timer2.getDate()} ${
          months[timer2.getMonth()].full
        } ${timer2.getFullYear()}`;
      } else {
        return "Today";
      }
    } else {
      return null;
    }
  } else if (type && type === "month_day") {
    const ongoing = timer > currentTimer;
    return {
      date: `${months[timer.getMonth()].full} ${timer.getDate()}`,
      ongoing,
    };
  } else if (type && type === "month_year") {
    const ongoing = timer > currentTimer;
    return {
      date: ongoing
        ? "Currently airing"
        : `${months[timer.getMonth()].full} ${timer.getFullYear()}`,
      ongoing,
    };
  } else {
    if (tHr > 12) {
      hr = tHr % 12 === 0 ? 12 : tHr % 12;
      post = "PM";
    } else {
      hr = tHr === 0 ? 12 : tHr;
      post = "AM";
    }

    if (tMin < 10) {
      min = `0${tMin}`;
    } else {
      min = tMin;
    }

    const convDate = `${hr}:${min} ${post}`;
    return {
      time: convDate,
      hr,
      min,
      post,
    };
  }
};

export const getDateObject = (date) => {
  const dater = new Date(date);
  const dateMonth = calender.months[dater.getMonth()].full.toUpperCase();
  const dateYear = dater.getFullYear();
  const dateDay = dater.getDate();

  return {
    month: dateMonth,
    year: dateYear,
    day: dateDay,
    isFuture: dater > Date.now(),
  };
};
