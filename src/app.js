import { view, watch } from './view';
import { isDuplicate, isValidInputValue } from './validators';
import parser from './parser';
import fetchRssData from './fetcher';

export default () => {
  const state = {
    input: '',
    isValid: true,
    rss: {
      feeds: [],
    },
  };

  const watchedObject = watch(state);

  // CONTROLLERS
  view.input.addEventListener('input', (e) => {
    const { value } = e.target;
    watchedObject.input = value;
  });

  view.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isValid =
      (await isValidInputValue(watchedObject.input)) &&
      !isDuplicate(watchedObject.rss.feeds, watchedObject.input);
    watchedObject.isValid = isValid;
  });

  const URL = 'http://lorem-rss.herokuapp.com/feed';

  fetchRssData(URL).then((data) => {
    const elP = document.createElement('p');
    const newData = parser(data, 'application/xml');
    elP.textContent = newData;
    document.body.appendChild(elP);
  });
};
