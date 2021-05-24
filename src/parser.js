import _ from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const newData = parser.parseFromString(data, 'text/html');
  console.log(newData);
  // MAKE FEED OBJECT
  const id = _.uniqueId();
  const title = newData.documentElement.querySelector('channel title')
    .textContent;
  const description = newData.documentElement.querySelector(
    'channel description'
  ).textContent;
  console.log(newData);
  return {
    id,
    title,
    description,
  };
};
