'use strict';

const { ObjectId } = require('@fastify/mongodb');
const moment = require('moment');

const COLLECTION_NAME = 'tasks';

/**
 * TODO:
 * - collection name should be put in middleware
 * - convert to typescript
 */

async function getAllTasks(request, reply) {
  const collection = this.mongo.db.collection(COLLECTION_NAME);
  try {
    const page = request.query.page || 1;
    const pageSize = Number(request.query.pageSize) || 10;
    const search = request.query.search || null;
    const skip = (page - 1) * pageSize;
    const query = search ? { name: search, deletedAt: { $ne: null } } : { deletedAt: { $ne: null } };

    const res = await collection.find(query).skip(skip).limit(pageSize).toArray();
    return reply.code(200).send(res);
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
    console.log(request.params);
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
          status: request.body.status,
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
