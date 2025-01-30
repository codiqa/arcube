const isUrlValid = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const getShortenUrl = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < 6; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return result;
};

module.exports = { isUrlValid, getShortenUrl };
