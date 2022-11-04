import Joi from 'joi';
import { CustomError } from './error.js';

const validationHelper = async (schema, payload) => {
  try {
    await schema.validateAsync(payload);
  } catch (error) {
    throw new CustomError(error);
  }
};

const ipv4Schema = Joi.string().ip({ version: 'ipv4' }).required();
export const validateIPv4 = (ip) => validationHelper(ipv4Schema, ip);
