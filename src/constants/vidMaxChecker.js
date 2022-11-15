export default (videoMillis, duration = 105) => {
  // DURATION IS MAX TIME IN SECONDS:: DEFAULT = 105: 1min 45secs
  const videoSecs = Math.round(videoMillis / 1000);

  if (videoSecs > duration) {
    // EXCEEDS DURATION
    return {
      bool: true,
      vidErr: `Video maxlength of ${duration}seconds exceeded`,
    };
  } else {
    return { bool: false, vidErr: null };
  }
};
