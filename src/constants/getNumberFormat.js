let formattedNumber;
export default (number) => {
  if (number >= 100000000000) {
    formattedNumber = `${number.toString().substr(0, 3)}B`;
  } else if (number >= 10000000000) {
    formattedNumber = `${number.toString().substr(0, 2)}B`;
  } else if (number >= 1000000000) {
    formattedNumber = `${number.toString().substr(0, 1)}B`;
  } else if (number >= 100000000) {
    formattedNumber = `${number.toString().substr(0, 3)}M`;
  } else if (number >= 10000000) {
    formattedNumber = `${number.toString().substr(0, 2)}M`;
  } else if (number >= 1000000) {
    formattedNumber = `${number.toString().substr(0, 1)}M`;
  } else if (number >= 100000) {
    formattedNumber = `${number.toString().substr(0, 3)}K`;
  } else if (number >= 10000) {
    formattedNumber = `${number.toString().substr(0, 2)}K`;
  } else if (number >= 1000) {
    formattedNumber = `${number.toString().substr(0, 1)}K`;
  } else {
    formattedNumber = number;
  }
  return formattedNumber;
};
