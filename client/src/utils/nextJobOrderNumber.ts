const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

const jobOrderNumber = (currJobOrderNumber: string, lastLetter: string) => {
  // DIY = 000001Y
  // Drop-Off = 000001F
  const lastChar = currJobOrderNumber && currJobOrderNumber?.slice(-1);
  const joWithoutLast = currJobOrderNumber && currJobOrderNumber?.slice(0, -1);
  const correctNum = +parseInt(joWithoutLast);
  return `${zeroPad(correctNum + 1, 6)}${
    lastLetter === "" ? lastChar : lastLetter
  }`;
};

export default jobOrderNumber;
