import { render, view, watch } from './view.js';
import parser from './parser';
import getProxyUrl from './proxy';
import fetchRssData from './fetcher';
import checkUrlValidity from './validators';

export default () => {
  const state = {
    input: '',
    urlValidity: true,
    rss: {
      feeds: [],
      posts: [],
      links: [],
    },
  };

  const watchedObject = watch(state);

  view.input.addEventListener('input', (e) => {
    const { value } = e.target;
    watchedObject.input = value;
  });

  view.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlValidity = await checkUrlValidity(
      watchedObject.rss.links,
      watchedObject.input
    );
    watchedObject.urlValidity = urlValidity;
    if (urlValidity === 'valid') {
      watchedObject.rss.links = [
        ...watchedObject.rss.links,
        watchedObject.input,
      ];
    }
  });

  const mockURL = 'https://ru.hexlet.io/lessons.rss';
  const proxyRssUrl = getProxyUrl(mockURL);

  fetchRssData(proxyRssUrl).then((data) => {
    const newData = parser(data);
    const { feed, posts } = newData;
    watchedObject.rss.feeds = [...watchedObject.rss.feeds, feed];
    watchedObject.rss.posts = [...watchedObject.rss.posts, posts];
    console.log(watchedObject);
  });

  const { feeds, posts } = watchedObject.rss;
  render(feeds, posts);
};
