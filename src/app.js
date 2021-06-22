import _ from 'lodash';
import i18next from 'i18next';
import { render, view, watch } from './view.js';
import parser from './parser';
import getProxyUrl from './proxy';
import fetchFeedData from './fetcher';
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

  const getParsedRssData = async (url) => {
    const proxyRssUrl = getProxyUrl(url);
    const result = await fetchFeedData(proxyRssUrl).then((data) =>
      parser(data)
    );
    return result;
  };

  const updateFeed = async () => {
    const delay = 2000;
    setTimeout(async () => {
      console.log('UPDATING');
      const { feeds, posts, links } = watchedObject;
      const newFeedsColl = [];
      const newPostsColl = [];
      await links.forEach(async (link) => {
        const { feed: newFeed, posts: newPosts } = await getParsedRssData(link);
        newFeedsColl.push(newFeed);
        newPostsColl.push(newPosts);
      });
      console.log(newFeedsColl);
      console.log(newPostsColl);
      const diffFeeds = _.differenceWith(newFeedsColl, feeds, _.isEqual);
      const diffPosts = _.differenceWith(newPostsColl, posts, _.isEqual);
      if (!_.isEmpty(diffFeeds) || !_.isEmpty(diffPosts)) {
        watchedObject.feeds = newFeedsColl;
        watchedObject.posts = newPostsColl;
        render(watchedObject.feeds, watchedObject.posts);
      }

      await updateFeed();
    }, delay);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    watchedObject.form.processState = 'sending';
    const url = watchedObject.form.input;
    const urlValid = await checkUrlValidity(watchedObject.links, url);
    watchedObject.form.valid = urlValid;
    if (urlValid === 'valid') {
      watchedObject.links = [...watchedObject.links, url];
      updateFeed();
    }
  };

  const handleInput = (e) => {
    const { value } = e.target;
    if (e.target.value === '') {
      state.form.processState = 'filling';
    }
    watchedObject.form.input = value;
  };

  view.form.addEventListener('submit', handleSubmit);
  view.input.addEventListener('input', handleInput);
};
