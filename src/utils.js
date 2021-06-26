import axios from 'axios';
import * as yup from 'yup';
import { setLocale } from 'yup';
import _ from 'lodash';
import parse from './parser';

export const getLoadingProcessErrorType = (e) => {
  if (e.isParsingError) {
    return 'errorMessage.invalidRSS';
  }

  if (e.isAxiosError) {
    return 'errorMessage.network';
  }

  return 'errorMessage.unknownError';
};

export const validate = (url, urls) => {
  setLocale({
    string: {
      url: 'errorMessage.invalidUrl',
    },
    mixed: {
      required: 'errorMessage.emptyField',
      notOneOf: 'errorMessage.existedRss',
    },
  });
  const schema = yup.string().trim().url().required()
    .notOneOf(urls);

  try {
    schema.validateSync(url);
    return null;
  } catch (err) {
    return err.message;
  }
};

const addProxy = (url) => {
  const urlWithProxy = new URL(
    '/get',
    'https://hexlet-allorigins.herokuapp.com',
  );
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', true);
  return urlWithProxy.toString();
};

export const sendRequest = (url) => {
  const urlWithProxy = addProxy(url);
  return axios.get(urlWithProxy).then((response) => {
    const { data } = response;
    return data.contents;
  });
};

export const fetchNewPosts = (state) => {
  const { feeds, posts: statePosts } = state;
  const fetchingTime = 5000;
  const promises = feeds.map((feed) => sendRequest(feed.url).then((responseData) => ({
    id: feed.id,
    responseData,
  })));
  const promise = Promise.all(promises);

  promise
    .then((responses) => responses.flatMap((item) => {
      const { id, responseData } = item;
      const parsedItems = parse(responseData);
      const { posts: receivedPosts } = parsedItems;
      const postsWithFeedId = receivedPosts.map((post) => ({ ...post, id }));
      return postsWithFeedId;
    }))
    .then((posts) => {
      const newPosts = _.differenceBy(posts, statePosts, 'title');
      const newPostsWithPostId = newPosts.map((item) => ({
        ...item,
        postId: _.uniqueId(),
      }));
      state.posts = newPostsWithPostId.concat(statePosts);
    });

  setTimeout(() => fetchNewPosts(state), fetchingTime);
};

export const addRss = (data, state, url) => {
  const { feeds: stateFeeds, posts: statePosts } = state;
  const { feed, posts: receivedPosts } = data;
  const id = _.uniqueId();
  const newFeed = { ...feed, id, url };
  state.feeds = [newFeed, ...stateFeeds];

  const mappedPosts = receivedPosts.map((post) => ({
    ...post,
    id,
    postId: _.uniqueId(),
  }));
  state.posts = mappedPosts.concat(statePosts);
};
