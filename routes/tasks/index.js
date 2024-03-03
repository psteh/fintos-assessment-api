'use strict';

const { getAllTasks, getTaskById, createTask, updateTask } = require('../../controllers/Tasks');

const TaskRoutes = async function (fastify, opts) {
  fastify.get(
    '/',
    {
      schema: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          pageSize: { type: 'string' },
          sort: { type: 'string' },
          search: { type: 'string' },
        },
      },
    },
    getAllTasks,
  );
  fastify.get(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    getTaskById,
  );
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'description', 'dueDate'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string' },
          },
        },
      },
    },
    createTask,
  );
  fastify.put(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          required: ['name', 'description', 'dueDate'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            dueDate: { type: 'string' },
          },
        },
      },
    },
    updateTask,
  );
};

module.exports = TaskRoutes;
