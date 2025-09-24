import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv); // For date-time format support

export const articleResponseSchema = {
  type: 'object',
  properties: {
    slug: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    body: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
    favorited: {
      type: 'boolean',
    },
    favoritesCount: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
    },
    tagList: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    author: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        bio: {
          type: ['string', 'null'],
        },
        image: {
          type: ['string', 'null'],
          format: 'uri',
        },
        following: {
          type: 'boolean',
        },
      },
      required: ['username', 'following'],
      additionalProperties: false,
    },
  },
  required: [
    'slug',
    'title',
    'body',
    'createdAt',
    'updatedAt',
    'favorited',
    'favoritesCount',
    'tagList',
    'author',
  ],
  additionalProperties: false,
};
