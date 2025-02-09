import * as Joi from 'joi';

export default () => {
  const currencyPairs = {};

  Object.keys(process.env).forEach((key) => {
    if (key.endsWith('_THRESHOLD')) {
      const pair = key.replace('_THRESHOLD', '').split('_').join('-');

      currencyPairs[pair] = {
        threshold: parseFloat(process.env[key] || '0.01'),
      };
    }
  });

  const schema = Joi.object({
    PORT: Joi.number().required(),
    CURRENCY_API_URL: Joi.string().uri().required(),
    CURRENCY_PAIRS: Joi.object()
      .pattern(
        Joi.string(),
        Joi.object({
          threshold: Joi.number().required(),
        }),
      )
      .required()
      .min(1),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
  });

  const config = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    CURRENCY_API_URL:
      process.env.CURRENCY_API_URL || 'https://api.uphold.com/v0',
    CURRENCY_PAIRS: currencyPairs,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_USERNAME: process.env.DB_USERNAME || 'user',
    DB_PASSWORD: process.env.DB_PASSWORD || 'r00t',
    DB_DATABASE: process.env.DB_DATABASE || 'currency',
  };

  const { error } = schema.validate(config, { abortEarly: false });

  if (error) {
    throw new Error(
      `Config validation error: ${error.details.map((d) => d.message).join(', ')}`,
    );
  }

  return config;
};
