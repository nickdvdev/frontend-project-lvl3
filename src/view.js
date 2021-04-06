import onChange from 'on-change';

export const view = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('input[aria-label="url"]'),
  button: document.querySelector('input[aria-label="add"]'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
};

export const watch = (state) => {
  const watchedObject = onChange(state, (path, value) => {
    if (path === 'isValid') {
      if (value) {
        view.input.classList.remove('is-invalid');
        view.feedback.classList.remove('text-danger');
        view.feedback.textContent = '';
      } else {
        view.input.classList.add('is-invalid');
        view.feedback.classList.add('text-danger');
        view.feedback.textContent = 'Ссылка должна быть валидным URL';
      }
    }
    if (path === 'input') {
      view.input.value = watchedObject.input;
    }
  });

  return watchedObject;
};
