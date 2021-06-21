import _ from 'lodash';
import i18next from 'i18next';
import { view, watch } from './view.js';
import parser from './parser';
import getProxyUrl from './proxy';
import getFeedData from './fetcher';
import checkUrlValidity from './validators';
import locales from './locales';

const getNewPosts = (currentPosts, oldPosts) =>
  _.differenceWith(currentPosts, oldPosts, _.isEqual);

export default () => {
  i18next
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru: locales.ru,
      },
    })
    .then((t) => t);

  const state = {
    form: {
      processState: 'filling',
      processError: null,
      input: null,
      valid: true,
      error: null,
    },
    feeds: [],
    posts: [],
    links: [],
  };

  const watchedObject = watch(state);

  window.onload = () => {
    const preloader = document.querySelector('.spinner');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 1000);
  };

  const getParsedRssData = (url) => {
    const proxyRssUrl = getProxyUrl(url);
    return getFeedData(proxyRssUrl).then((data) => parser(data));
  };

  const updateFeed = (url) => {
    const delay = 5000;
    setTimeout(async () => {
      const { feed, posts } = await getParsedRssData(url);
      watchedObject.feeds = [...watchedObject.feeds, feed];
      watchedObject.posts = [...watchedObject.posts, ...posts];
      const diff = _.differenceWith(posts, watchedObject.posts, getNewPosts);
      if (!_.isEmpty(diff)) {
        watchedObject.feeds = [...watchedObject.feeds, feed];
        watchedObject.posts = [...watchedObject.posts, ...posts];
      }

      updateFeed(url);
    }, delay);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    watchedObject.form.processState = 'sending';
    const url = watchedObject.input;
    const urlValid = await checkUrlValidity(watchedObject.links, url);
    watchedObject.form.valid = urlValid;
    if (urlValid === 'valid') {
      watchedObject.links = [...watchedObject.links, url];
      updateFeed(url);
    }
  };

  const handleInput = (e) => {
    const { value } = e.target;
    if (e.target.value === '') {
      state.form.processState = 'filling';
    }
    watchedObject.input = value;
  };

  view.form.addEventListener('submit', handleSubmit);
  view.input.addEventListener('input', handleInput);
};
