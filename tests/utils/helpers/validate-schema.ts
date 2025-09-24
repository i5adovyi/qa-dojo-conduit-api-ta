import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

/**
 * @data Actual response
 * @schema - your validation schema */
export const validateWithSchema = (data: unknown, schema: object) => {
  const validate = ajv.compile(schema);
  const isValid = validate(data);
  return {
    isValid,
    errors: validate.errors,
  };
};
