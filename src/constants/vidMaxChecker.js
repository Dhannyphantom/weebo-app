export default (videoMillis, duration) => {
  // DURATION IS LIKE LEVEL = [5,4,3,2,1]
  const videoSecs = Math.round(videoMillis / 1000);
  let maxDuration, time;
  switch (duration) {
    case 5:
      maxDuration = 60 * 2 + 30; // 2min 30s
      time = "2min 30s";
      break;
    case 4:
      maxDuration = 60; // 2min 30s
      time = "60s";
      break;
    default:
      maxDuration = 45;
      time = "45 seconds";
  }
  if (videoSecs > maxDuration) {
    // EXCEEDS DURATION
    return { bool: true, vidErr: `Video maxlength of ${time} exceeded` };
  } else {
    return { bool: false, vidErr: null };
  }
};
