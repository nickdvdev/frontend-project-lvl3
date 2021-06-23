/* eslint-disable no-param-reassign */

import onChange from 'on-change';
import 'bootstrap/js/dist/modal';

const linkFontClassBootstrap = {
  default: 'font-weight-bold',
  read: 'font-weight-normal',
};

const linkFontClassBootstrap5 = {
  default: 'fw-bold',
  read: 'fw-normal',
};

const renderFeeds = (state, elements, i18n) => {
  elements.feeds.innerHTML = '';
  const { feeds } = state;
  const feedsHead = document.createElement('h2');
  feedsHead.textContent = i18n.t('feedsHead');
  elements.feeds.append(feedsHead);
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  ul.classList.add('mb-5');
  feedsHead.after(ul);
  feeds.forEach((feed) => {
    const { title, description } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    ul.append(li);
    const h = document.createElement('h3');
    li.append(h);
    h.textContent = title;
    const p = document.createElement('p');
    h.after(p);
    p.textContent = description;
  });
};

const renderPosts = (state, elements, i18n) => {
  elements.posts.innerHTML = '';
  const { posts } = state;
  if (posts.length === 0) {
    return;
  }
  const postsHead = document.createElement('h2');
  postsHead.textContent = i18n.t('postsHead');
  elements.posts.append(postsHead);
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  posts.forEach((post) => {
    const { title, postLink, postId } = post;

    const postContainer = document.createElement('li');
    postContainer.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start'
    );

    const linkElement = document.createElement('a');
    linkElement.textContent = title;
    linkElement.href = postLink;
    linkElement.setAttribute('data-id', `${postId}`);
    linkElement.setAttribute('target', '_blank');
    linkElement.setAttribute('rel', 'noopener noreferrer');

    const actualFontClassBootstrap5 = state.uiState.readPosts.has(postId)
      ? linkFontClassBootstrap5.read
      : linkFontClassBootstrap5.default;

    const actualFontClassBootstrap = state.uiState.readPosts.has(postId)
      ? linkFontClassBootstrap.read
      : linkFontClassBootstrap.default;

    linkElement.classList.add(
      actualFontClassBootstrap,
      actualFontClassBootstrap5,
      'text-decoration-none',
      'm-2',
      'link'
    );

    const modalButton = document.createElement('button');
    modalButton.classList.add('btn', 'btn-primary', 'btn-sm');
    modalButton.setAttribute('data-id', `${postId}`);
    modalButton.setAttribute('data-bs-toggle', 'modal');
    modalButton.setAttribute('data-bs-target', '#modal');
    modalButton.textContent = i18n.t('view');

    postContainer.append(linkElement);
    postContainer.append(modalButton);
    ul.append(postContainer);
  });
  postsHead.after(ul);
};

const renderAppError = (error, elements, i18n) => {
  elements.feedback.innerHTML = '';
  if (error) {
    elements.feedback.textContent = i18n.t(error);
  }
};

const renderFormError = (state, elements, i18n) => {
  const { rssField } = state.form;
  if (rssField.valid) {
    elements.input.classList.remove('danger-text');
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = i18n.t(rssField.error);
  }
};

const renderForm = (dataProcess, elements, i18n) => {
  switch (dataProcess) {
    case 'initial':
      elements.submitButton.focus();
      elements.input.select();
      break;
    case 'sending':
      elements.submitButton.setAttribute('disabled', true);
      elements.input.setAttribute('readonly', true);
      elements.submitButton.focus();
      break;
    case 'failed':
      elements.submitButton.removeAttribute('disabled');
      elements.input.removeAttribute('readonly');
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      elements.input.select();
      elements.submitButton.focus();
      elements.input.value = '';
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      break;
    case 'processed':
      elements.submitButton.removeAttribute('disabled');
      elements.input.classList.remove('danger-text');
      elements.input.classList.remove('is-invalid');
      elements.input.removeAttribute('readonly');
      elements.input.value = '';
      elements.input.select();
      elements.feedback.classList.add('text-success');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.textContent = i18n.t('successMessage');
      break;
    default:
      throw new Error(`Unknown process ${dataProcess}`);
  }
};

const renderModalContent = (state, elements) => {
  const { modalContentId: id, posts } = state;
  if (!id) {
    elements.modalElements.modalContainer.classList.remove('show');
    elements.modalElements.modalContainer.style.display = 'none';
    return;
  }
  const relatedPost = posts.find((post) => post.postId === id);
  const { title, description, postLink } = relatedPost;
  elements.modalElements.modalContainer.classList.add('show');
  elements.modalElements.modalContainer.style.display = 'block';
  elements.modalElements.modalTitle.textContent = title;
  elements.modalElements.modalBody.textContent = description;
  elements.modalElements.modalRef.href = postLink;
};

const initview = (state, elements, i18n) => {
  const mapping = {
    feeds: () => renderFeeds(state, elements, i18n),
    posts: () => renderPosts(state, elements, i18n),
    error: () => renderAppError(state.error, elements, i18n),
    'form.rssField': () => renderFormError(state, elements, i18n),
    dataProcess: () => renderForm(state.dataProcess, elements, i18n),
    'uiState.readPosts': () => renderPosts(state, elements, i18n),
    modalContentId: () => renderModalContent(state, elements),
  };

  const watchedState = onChange(state, (path) => mapping[path]?.());
  return watchedState;
};

export default initview;
