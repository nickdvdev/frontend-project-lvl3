import onChange from 'on-change';

export const view = {
  form: document.getElementById('rss-form'),
  input: document.getElementById('rss-input'),
  button: document.getElementById('rss-button'),
  feed: document.getElementById('rss-feed'),
};

export const watch = (state) => {
  const watchedObject = onChange(state, (path, value) => {
    if (path === 'isValid') {
      if (value) {
        view.input.classList.remove('is-invalid');
      } else {
        view.input.classList.add('is-invalid');
      }
    }
    if (path === 'input') {
      view.input.value = watchedObject.input;
    }
  });

  return watchedObject;
};
