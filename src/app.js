import { view, watch } from './view';
import parser from './parser';
import fetchRssData from './fetcher';
import checkUrlValidity from './validators';

export default () => {
  const state = {
    input: '',
    urlValidity: true,
    rss: {
      feeds: [
        {
          id: 1,
          title: 'title',
          description: 'description',
          link: 'link',
        },
      ],
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
    const urlValidity = await checkUrlValidity(
      watchedObject.rss.feeds,
      watchedObject.input
    );
    watchedObject.urlValidity = urlValidity;
    if (urlValidity === 'valid') {
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
    elDiv.innerHTML = JSON.stringify(newData);
    view.feeds.appendChild(elDiv);
  });
};
