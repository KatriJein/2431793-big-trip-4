function getLastWord(string) {
  const words = string.split(' ');
  return words.at(-1);
}

function upperFirstChar(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { getLastWord, upperFirstChar };
