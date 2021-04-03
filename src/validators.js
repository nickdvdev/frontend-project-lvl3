import * as yup from 'yup';

const schema = yup
  .string()
  .url()
  .matches(/\.rss$/i);

export const validateInputValue = async (value) => schema.isValid(value);

export const isDuplicate = () => {};
