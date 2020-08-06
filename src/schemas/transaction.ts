import Joi from '@hapi/joi';

export const createTransaction = {
  body: Joi.object({
    title: Joi.string().min(1).required(),
    category: Joi.string().min(1).required(),
    value: Joi.number().integer().required(),
    type: Joi.string().valid('outcome', 'income').required(),
  }),
};

export const deleteTransaction = {
  params: Joi.object({
    transactionId: Joi.string().uuid().required(),
  }),
};
