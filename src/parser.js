import _ from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const newData = parser.parseFromString(data, 'text/html');
  // FEED
  const feedId = _.uniqueId();
  const title = newData.documentElement.querySelector('channel title')
    .textContent;
  const description = newData.documentElement.querySelector(
    'channel description'
  ).textContent;
  const feed = {
    id: feedId,
    title,
    description,
  };
  // POSTS
  const postItems = newData.documentElement.querySelectorAll('Item');
  let posts = [];
  postItems.forEach((post) => {
    const postTitle = post.querySelector('title').textContent;
    const postDescription = post.querySelector('description').textContent;
    const postLink = post.querySelector('link').textContent;
    const postGuid = post.querySelector('guid').textContent;
    const newPost = {
      feedId,
      id: postGuid,
      title: postTitle,
      description: postDescription,
      link: postLink,
    };
    posts = [...posts, newPost];
  });

  return { feed, posts };
};
