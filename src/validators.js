import * as yup from 'yup';

const schema = yup
  .string()
  .url()
  .matches(/\.rss$/i);

export const isValidInputValue = async (value) => schema.isValid(value);

export const isDuplicate = (coll, newItem) => coll.includes(newItem);
