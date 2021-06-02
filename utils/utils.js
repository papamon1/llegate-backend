const fs = require("fs");
const atob = require("atob");
const imgBaseUrl = "../../llegate-backend/public/posts_photos/";

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

exports.encodeFile = (dataurl, postNumber, index) => {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  //Creamos el directorio si no existe
  if (!fs.existsSync(`${imgBaseUrl}/${postNumber}`)) {
    fs.mkdirSync(`${imgBaseUrl}/post_${postNumber}`, {
      recursive: true,
    });
  }
  //Grabamos el fichero
  return fs.writeFileSync(
    `${imgBaseUrl}/post_${postNumber}/${postNumber}_${index}.png`,
    Buffer.from(u8arr)
  );
};
