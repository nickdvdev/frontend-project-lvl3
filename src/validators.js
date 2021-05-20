import * as yup from 'yup';

const schema = yup
  .string()
  .url()
  .matches(/\.rss$/i);

const isValidInputValue = async (value) => schema.isValid(value);

const isDuplicate = (coll, newItem) => coll.includes(newItem);

export default async (feeds, url) => {
  const isValidRss = await isValidInputValue(url);
  const isDuplicateRss = isDuplicate(feeds, url);
  if (!isValidRss) {
    return 'invalid';
  }
  if (isDuplicateRss) {
    return 'duplicate';
  }
  return 'valid';
};
