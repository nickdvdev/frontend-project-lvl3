import i18next from 'i18next';
import * as yup from 'yup';

yup.setLocale({
  mixed: {
    default: i18next.t('yupDefaultErrorMessage'),
  },
});

const schema = yup
  .string()
  .url()
  .matches(/\.rss$/i);

const isValidInputValue = async (value) =>
  schema
    .isValid(value)
    .then((e) => e)
    .catch((e) => e.errors);

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
