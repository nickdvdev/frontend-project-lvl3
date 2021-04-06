import { view, watch } from './view';
import { isDuplicate, isValidInputValue } from './validators';
import parser from './parser';
import fetchRssData from './fetcher';

export default () => {
  const state = {
    input: '',
    isValid: true,
    rss: {
      feeds: [],
      posts: [],
    },
  };

  const watchedObject = watch(state);

  view.input.addEventListener('input', (e) => {
    const { value } = e.target;
    watchedObject.input = value;
  });

  view.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isValid =
      (await isValidInputValue(watchedObject.input)) &&
      !isDuplicate(watchedObject.rss.feeds, watchedObject.input);
    watchedObject.isValid = isValid;
    if (isValid) {
      watchedObject.rss.feeds = [
        ...watchedObject.rss.feeds,
        watchedObject.input,
      ];
    }
  });

  const getProxyUrl = (url) => {
    const proxyURL = 'https://hexlet-allorigins.herokuapp.com';
    const rssURL = new URL(url);
    return `${proxyURL}/get/?url=${rssURL}`;
  };

  const mockURL = 'https://ru.hexlet.io/lessons.rss';
  const proxyRssUrl = getProxyUrl(mockURL);

  fetchRssData(proxyRssUrl).then((data) => {
    const elDiv = document.createElement('div');
    const newData = parser(data);
    elDiv.innerHTML = newData;
    view.feeds.appendChild(elDiv);
  });
};
