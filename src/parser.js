export default async (data, format) => {
  const awaitData = await data;
  const parser = new DOMParser();
  const newData = parser.parseFromString(awaitData, format);
  return newData.documentElement.textContent;
};
