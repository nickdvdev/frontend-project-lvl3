import { view, watch } from './view';
import { isDuplicate, isValidInputValue } from './validators';
import parser from './parser';

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
    // const formData = new FormData(e.target);
    // const inputValue = formData.get('rss-feed');
    const isValid =
      (await isValidInputValue(watchedObject.input)) &&
      !isDuplicate(watchedObject.rss.feeds, watchedObject.input);
    watchedObject.isValid = isValid;
  });

  // HEXLET GETTER
  const data = fetch(
    `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
      'http://lorem-rss.herokuapp.com/feed'
    )}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then((data) => data.contents);

  console.log(data);

  //parser
  const newData = parser(data, 'application/xml');
};
