const utilities = {};

utilities.createRandomString = (strlength) => {
  let length = strlength;
  length = typeof strlength === "number" && strlength > 0 ? strlength : false;

  if (length) {
    const possiblecharacters = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 1; i <= length; i += 1) {
      const randomCharacter = possiblecharacters.charAt(
        Math.floor(Math.random() * possiblecharacters.length)
      );
      output += randomCharacter;
    }
    return output;
  }
  return false;
};

utilities.parseJson = (jsonstring) => {
  let output;
  try {
    output = JSON.parse(jsonstring);
  } catch (e) {
    output = null;
  }

  return output;
};

module.exports = utilities;
