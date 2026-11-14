import { Router } from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

const router = Router();

router.get('/', async (_request, response) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  response.json(todos);
});

router.post('/', async (request, response) => {
  const text = typeof request.body.text === 'string' ? request.body.text.trim() : '';
  if (!text) {
    return response.status(400).json({ message: 'Todo text is required.' });
  }

  const todo = await Todo.create({ text });
  response.status(201).json(todo);
});

router.put('/:id', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ message: 'Invalid todo id.' });
  }

  const updates = {};
  if (typeof request.body.text === 'string') {
    const text = request.body.text.trim();
    if (!text) {
      return response.status(400).json({ message: 'Todo text cannot be empty.' });
    }
    updates.text = text;
  }
  if (typeof request.body.completed === 'boolean') {
    updates.completed = request.body.completed;
  }
  if (Object.keys(updates).length === 0) {
    return response.status(400).json({ message: 'Provide text or completed to update.' });
  }

  const todo = await Todo.findByIdAndUpdate(request.params.id, updates, {
    new: true,
    runValidators: true
  });
  if (!todo) {
    return response.status(404).json({ message: 'Todo not found.' });
  }
  response.json(todo);
});

router.delete('/:id', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ message: 'Invalid todo id.' });
  }

  const todo = await Todo.findByIdAndDelete(request.params.id);
  if (!todo) {
    return response.status(404).json({ message: 'Todo not found.' });
  }
  response.status(204).end();
});

export default router;
