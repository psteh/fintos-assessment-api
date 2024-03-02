'use strict';

const { ObjectId } = require('@fastify/mongodb');
const moment = require('moment');

const COLLECTION_NAME = 'tasks';

/**
 * TODO:
 * - collection name should be put in middleware
 * - convert to typescript
 * - add validation schema
 * - improve API route to /api/*
 * - add checking if due date is within 7 date (DUE_SOON status if Due date is within 7 days)
 */

async function getAllTasks(request, reply) {
  const collection = this.mongo.db.collection(COLLECTION_NAME);
  try {
    const page = parseInt(request.query.page) || 1;
    const pageSize = Number(request.query.pageSize) || 10;
    const search = request.query.search.length > 0 ? request.query.search : null;
    const skip = (page - 1) * pageSize;
    const query = search ? { name: search, deletedAt: null } : { deletedAt: null };

    const totalDocuments = await collection.countDocuments();
    const rows = await collection.find(query).skip(skip).limit(pageSize).toArray();
    const totalPages = Math.ceil(totalDocuments / pageSize);

    return reply.code(200).send({ page, rows, totalPages });
  } catch (err) {
    request.log.error(err.message);
    return reply.code(500).send({ message: err.message });
  }
}

async function getTaskById(request, reply) {
  const collection = this.mongo.db.collection(COLLECTION_NAME);
  try {
    const task = await collection.findOne({ _id: id, deletedAt: null }, { _id: 0 });

    if (!task) {
      request.log.warn(`task ID ${id} not found`);
      return reply.code(404).send({ message: 'Task not found' });
    }

    return reply.code(200).send({ ...task, id: task._id });
  } catch (err) {
    request.log.error(err.message);
    return reply.code(500).send({ message: err.message });
  }
}

async function createTask(request, reply) {
  const collection = this.mongo.db.collection(COLLECTION_NAME);
  try {
    const res = await collection.insertOne({
      name: request.body.name,
      description: request.body.description,
      dueDate: request.body.dueDate,
      status: request.body.status,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      deletedAt: null,
    });

    return reply.code(200).send({ id: res.insertedId });
  } catch (err) {
    request.log.error(err.message);
    return reply.code(500).send({ message: err.message });
  }
}

async function updateTask(request, reply) {
  const collection = this.mongo.db.collection(COLLECTION_NAME);
  try {
    const id = new ObjectId(request.params.id);
    const task = await collection.findOne({ _id: id, deletedAt: null }, { _id: 0 });

    if (!task) {
      request.log.warn(`task ID ${id} not found`);
      return reply.code(404).send({ message: 'Task not found' });
    }

    await collection.updateOne(
      { _id: id },
      {
        $set: {
          name: request.body.name,
          description: request.body.description,
          dueDate: request.body.dueDate,
          status: request.body.status || task.status,
          updatedAt: moment().toISOString(),
        },
      },
    );

    return reply.code(200).send({ ...task, id: task._id });
  } catch (err) {
    request.log.error(err.message);
    return reply.code(500).send({ message: err.message });
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
};
