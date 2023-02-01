import { calender } from "./data_store";

export default (id, format, countdown) => {
  //countdow is time in secs
  if (!id) return "";
  const timestamp = id.toString().substring(0, 8);

  const date = new Date(parseInt(timestamp, 16) * 1000);
  const currDate = new Date();
  const newDate = Math.ceil((currDate - date) / 1000);
  let convDate, timer;

  if (format === "raw") {
    return date;
  } else if (format === "millis") {
    return date.getTime();
  } else if (format === "status") {
    if (newDate >= 86400) {
      timer = `yesterday`;
    } else if (newDate >= 3600) {
      const num = Math.ceil(newDate / 3600);
      timer = `${num} hours ago`;
    } else if (newDate >= 60) {
      const num = Math.ceil(newDate / 60);
      timer = `${num} minutes ago`;
    } else if (newDate < 60) {
      const num = Math.abs(Math.ceil(newDate / 60));
      timer = `now`;
      // timer = `${num} seconds ago`;
    }
    return timer;
  } else if (format === "countdown") {
    const futureTime = date.getTime() / 1000 + countdown;
    const timerSecs = futureTime - currDate.getTime() / 1000;
    if (timerSecs >= 604800) {
      const num = Math.ceil(timerSecs / 604800);
      timer = `${num} weeks`;
    } else if (timerSecs >= 86400) {
      const num = Math.ceil(timerSecs / 86400);
      timer = `${num} days`;
    } else if (timerSecs >= 3600) {
      const num = Math.ceil(timerSecs / 3600);
      timer = `${num} hours`;
    } else if (timerSecs >= 60) {
      const num = Math.ceil(timerSecs / 60);
      timer = `${num} minutes`;
    } else if (timerSecs < 60) {
      const num = Math.abs(Math.ceil(timerSecs / 60));
      timer = `${num} seconds`;
    }
    return timer;
  } else if (format === "format") {
    let timerValue;
    const timerSecs = (date - currDate) / 1000;
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
        short: `${num}s`,
        full: `${num} seconds`,
        mid: `${num} sec`,
      };
    }
    return timerValue;
  } else if (format === "feed") {
    if (newDate >= 86400 * 2) {
      convDate = `${
        calender.months[date.getMonth()].short
      } ${date.getDate()}, ${date.getFullYear()}`;
    } else if (newDate >= 86400) {
      const num = Math.floor(newDate / 86400);
      convDate = `yesterday`;
    } else if (newDate >= 3600) {
      const num = Math.floor(newDate / 3600);
      convDate = `${num}h`;
    } else if (newDate >= 60) {
      const num = Math.floor(newDate / 60);
      convDate = `${num}m`;
    } else if (newDate < 60) {
      convDate = "now";
    }

    return convDate;
  } else {
    if (newDate >= 604800) {
      const num = Math.floor(newDate / 604800);
      convDate = `${num}w`;
    } else if (newDate >= 86400) {
      const num = Math.floor(newDate / 86400);
      convDate = `${num}d`;
    } else if (newDate >= 3600) {
      const num = Math.floor(newDate / 3600);
      convDate = `${num}h`;
    } else if (newDate >= 60) {
      const num = Math.floor(newDate / 60);
      convDate = `${num}m`;
    } else if (newDate < 60) {
      convDate = "now";
    }

    return convDate;
  }
};
