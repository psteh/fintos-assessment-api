'use strict';

const { getAllTasks, getTaskById, createTask, updateTask } = require('../../controllers/Tasks');

// import { getAllTasks, getTaskById, createTask, updateTask } from '../../controllers/Tasks';

/**
 * TODO:
 * - convert to typescript
 */

const TaskRoutes = async function (fastify, opts) {
  fastify.get('/', getAllTasks);
  fastify.get('/:id', getTaskById);
  fastify.post('/', createTask);
  fastify.put('/:id', updateTask);
};

module.exports = TaskRoutes;
