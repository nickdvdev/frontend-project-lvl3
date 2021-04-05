export default (url) => {
  return fetch(
    `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
      `${url}`
    )}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then((data) => data.contents);
};
