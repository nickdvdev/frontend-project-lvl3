export default (url) => {
  const proxyURL = 'https://hexlet-allorigins.herokuapp.com';
  const rssURL = new URL(url);
  return `${proxyURL}/get/?url=${rssURL}`;
};
