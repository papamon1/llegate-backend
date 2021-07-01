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

exports.sanitizeContactField = (contact) => {
  const newContact = {};
  const itemArray = contact.split('"');
  if (itemArray[1]) newContact[itemArray[1]] = itemArray[3];
  if (itemArray[5]) newContact[itemArray[5]] = itemArray[7];
  if (itemArray[9]) newContact[itemArray[9]] = itemArray[11];
  return Object.entries(newContact).length === 0 ? null : newContact;
};

exports.dirtyContactField = (contact) => {
  let contactString = "";
  Object.entries(contact).forEach((item, index) => {
    if (index !== 0) contactString = contactString + ", ";
    contactString = contactString + `"${item[0]}"=>"${item[1]}"`;
  });
  return contactString;
};

// Login google
// name = it.displayName,
//                         socialNetworkType = SocialNetworkEnum.GOOGLE,
//                         oauthToken = it.serverAuthCode,
//                         idToken = it.idToken

// Facebook Login

// val user = UserBO(
//                         socialNetworkType = SocialNetworkEnum.FACEBOOK,
//                         oauthToken = response.request.accessToken.token
//                     )
