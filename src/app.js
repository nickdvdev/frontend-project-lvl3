import onChange from 'on-change';
import view from './view';
import { validateInputValue } from './validators';

export default () => {
  const state = {
    input: '',
    isValid: true,
    rss: {
      feeds: [],
    },
  };

  const watchedObject = onChange(state, (path, value) => {
    if (path === 'isValid') {
      if (!value) {
        view.input.classList.add('is-invalid');
      } else {
        view.input.classList.remove('is-invalid');
      }
    }
  });

  view.input.addEventListener('change', async (e) => {
    const { value } = e.target;
    watchedObject.input = value;
    const isValid = await validateInputValue(value);
    watchedObject.isValid = isValid;
  });
};
