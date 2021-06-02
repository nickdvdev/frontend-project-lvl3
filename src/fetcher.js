import i18next from 'i18next';

export default (url) =>
  fetch(
    `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
      `${url}`
    )}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(i18next.t('fetcherError'));
    })
    .then((data) => data.contents);
