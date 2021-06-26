import i18next from 'i18next';
import initview from './view';
import {
  sendRequest,
  addRss,
  validate,
  getLoadingProcessErrorType,
  fetchNewPosts,
} from './utils';
import parse from './parser';
import resources from './locales';

const init = (i18n) => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    feedback: document.querySelector('.feedback'),
    submitButton: document.querySelector('button.add'),
    modalElements: {
      modalContainer: document.querySelector('#modal'),
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      modalRef: document.querySelector('.full-article'),
      modalCloseButtons: document.querySelectorAll(
        'button[data-dismiss="modal"]',
      ),
    },
  };

  const state = {
    form: {
      rssField: {
        valid: true,
        error: null,
      },
    },
    modalContentId: null,
    posts: [],
    feeds: [],
    savedUrls: [],
    error: null,
    dataProcess: 'initial',
    uiState: {
      readPosts: new Set(),
    },
  };

  window.onload = () => {
    const preloader = document.querySelector('.spinner');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 1000);
  };

  const watchedState = initview(state, elements, i18n);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    const urls = watchedState.savedUrls;

    const error = validate(url, urls, i18n);

    if (error) {
      watchedState.form.rssField = {
        valid: false,
        error,
      };
      return;
    }

    watchedState.form.rssField = {
      valid: true,
      error: null,
    };

    watchedState.dataProcess = 'sending';

    sendRequest(url)
      .then((xml) => {
        const data = parse(xml);
        watchedState.savedUrls.push(url);
        addRss(data, watchedState, url);
        watchedState.error = null;
        watchedState.dataProcess = 'processed';
      })
      .catch((err) => {
        watchedState.dataProcess = 'failed';
        watchedState.error = getLoadingProcessErrorType(err);
      });
  });

  const handleClose = (e) => {
    e.preventDefault();
    watchedState.modalContentId = null;
  };

  elements.modalElements.modalCloseButtons.forEach((button) => {
    button.addEventListener('click', handleClose);
  });

  elements.posts.addEventListener('click', (e) => {
    if (!('id' in e.target.dataset)) {
      return;
    }

    const { id } = e.target.dataset;
    watchedState.uiState.readPosts.add(id);
    watchedState.modalContentId = id;
  });

  fetchNewPosts(watchedState);
};

const runApp = () => {
  const defaultLanguage = 'ru';
  const newInstance = i18next.createInstance();
  newInstance
    .init({
      lng: defaultLanguage,
      debug: true,
      resources,
    })
    .then(() => init(newInstance));
};

export default runApp;
