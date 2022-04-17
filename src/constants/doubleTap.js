let touchTime = 0,
  timed;

const tapHandler = () => {
  const now = new Date().getTime();
  const diff = now - touchTime;
  let dPress = null;

  if (diff < 300 && diff > 0) {
    // double
    dPress = true;
    /// exec
    clearTimeout(timed);
  } else {
    // single
    timed = setTimeout(() => {
      if (!dPress) {
        // exec
      }
    }, 250);
  }

  touchTime = new Date().getTime();
};
