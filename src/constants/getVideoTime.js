export default (time) => {
  const tSec = time / 1000;
  const digit = (n) => (n < 10 ? `0${n}` : `${n}`);
  const sec = digit(Math.floor(tSec % 60));
  const min = digit(Math.floor((tSec / 60) % 60));
  const hr = digit(Math.floor((tSec / 3600) % 60));

  return min + ":" + sec;
};
