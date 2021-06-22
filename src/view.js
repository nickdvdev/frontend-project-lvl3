import i18next from 'i18next';
import onChange from 'on-change';

export const view = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('input[aria-label="url"]'),
  button: document.querySelector('input[aria-label="add"]'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
};

const renderFeeds = (feeds) => {
  // clean the div
  view.feeds.innerHTML = '';
  // header
  const feedsHeader = document.createElement('h2');
  feedsHeader.innerHTML = i18next.t('feeds');
  view.feeds.appendChild(feedsHeader);
  // container
  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'mb-5');
  view.feeds.appendChild(feedsList);
  // render each feed
  feeds.forEach((feed) => {
    const { title, description } = feed;
    // list item
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    feedsList.appendChild(listItem);
    // h3 item title
    const feedTitle = document.createElement('h3');
    feedTitle.innerHTML = title;
    listItem.appendChild(feedTitle);
    // p description
    const feedDescription = document.createElement('p');
    feedDescription.innerHTML = description;
    listItem.appendChild(feedDescription);
  });
};

const renderPosts = (posts) => {
  // clean the div
  view.posts.innerHTML = '';
  // header
  const postsHeader = document.createElement('h3');
  postsHeader.innerHTML = i18next.t('posts');
  view.posts.appendChild(postsHeader);
  // container
  const postsList = document.createElement('ul');
  postsList.classList.add('list-group');
  view.posts.appendChild(postsList);
  // post list item
  posts.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start'
    );
    postsList.appendChild(postItem);
    // post list item's link
    const postLink = document.createElement('a');
    postItem.appendChild(postLink);
    postLink.classList.add('font-weight-bold');
    postLink.setAttribute('href', `${post.link}`);
    postLink.setAttribute('data-id', `${post.id}`);
    postLink.setAttribute('target', '_blank');
    postLink.setAttribute('rel', 'noopener noreferrer');
    postLink.textContent = `${post.title}`;
    // post list item's button
    const postButton = document.createElement('button');
    postItem.appendChild(postButton);
    postButton.textContent = i18next.t('linkButton');
    postButton.classList.add('btn', 'btn-primary', 'btn-sm');
    postButton.setAttribute('type', 'button');
    postButton.setAttribute('data-id', '2');
    postButton.setAttribute('data-toggle', 'modal');
    postButton.setAttribute('data-target', '#modal');
  });
};

export const render = (feeds, posts) => {
  if (feeds.length > 0) {
    renderFeeds(feeds);
    renderPosts(posts);
  }
};

export const watch = (state) => {
  const watchedObject = onChange(state, (path, value) => {
    if (path === 'form.valid') {
      if (value === 'valid') {
        view.input.classList.remove('is-invalid');
        view.feedback.classList.remove('text-danger');
        view.feedback.classList.add('text-success');
        view.feedback.textContent = i18next.t('rssLinkAdded');
      } else if (value === 'duplicate') {
        view.input.classList.add('is-invalid');
        view.feedback.classList.add('text-danger');
        view.feedback.textContent = i18next.t('rssLinkIsDuplicate');
      } else {
        view.input.classList.add('is-invalid');
        view.feedback.classList.add('text-danger');
        view.feedback.textContent = i18next.t('rssLinkInvalid');
      }
    }
    if (path === 'form.input') {
      view.input.value = watchedObject.form.input;
    }
  });

  return watchedObject;
};
