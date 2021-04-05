export default (data, format) => {
  const parser = new DOMParser();
  const newData = parser.parseFromString(data, format);
  return newData.documentElement.textContent;
};
