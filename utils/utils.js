exports.formatStringToStore = (arr) => {
  let finalString = "{";
  arr.forEach((element, index) => {
    finalString += element;
    if (index != arr.length - 1) {
      finalString += ",";
    }
  });
  finalString += "}";
  return finalString;
};
