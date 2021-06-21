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
    getFeedData(proxyRssUrl).then((data) => {
      const newData = parser(data);
      return newData;
    });
  };

  const updateFeed = (url) => {
    const delay = 5000;
    setTimeout(() => {
      const { feed, posts } = getParsedRssData(url);
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

  // const updatePosts = () => {
  //   const { feeds, posts } = watchedObject;
  //   if (feeds.length === 0) {
  //     setTimeout(updatePosts, 5000);
  //   }
  //   feeds.forEach((feed) => {
  //     const oldPosts = posts.filter((post) => post.id === feed.id);
  //     const url = getUrl(feed.link);
  //     axios
  //       .get(url)
  //       .then((response) => {
  //         const data = parse(response.data);
  //         return data.posts.map((post) => ({ ...post, id: feed.id }));
  //       })
  //       .then((currentPosts) => getNewPosts(currentPosts, oldPosts))
  //       .then((newPosts) => {
  //         if (newPosts.length !== 0) {
  //           newPosts.forEach((post) => [post, ...state.posts]);
  //         }
  //       })
  //       .catch((error) => {
  //         state.form.valid = false;
  //         state.form.processForm = 'filling';
  //         state.form.error = 'network';
  //         throw error;
  //       })
  //       .finally(() => setTimeout(updatePosts, 5000));
  //   });
  // };
  // updatePosts();

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
