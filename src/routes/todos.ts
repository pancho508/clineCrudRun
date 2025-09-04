import { Router, Request, Response } from 'express';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/Todo';

const router = Router();

// In-memory storage for todos
let todos: Todo[] = [];
let nextId = 1;

// GET /todos - Get all todos
router.get('/', (req: Request, res: Response) => {
  res.json(todos);
});

// GET /todos/:id - Get a specific todo
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

// POST /todos - Create a new todo
router.post('/', (req: Request, res: Response) => {
  const { title, description }: CreateTodoRequest = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTodo: Todo = {
    id: nextId.toString(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  todos.push(newTodo);
  nextId++;

  res.status(201).json(newTodo);
});

// PUT /todos/:id - Update a todo
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed }: UpdateTodoRequest = req.body;

  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const updatedTodo: Todo = {
    ...todos[todoIndex],
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(completed !== undefined && { completed }),
    updatedAt: new Date()
  };

  todos[todoIndex] = updatedTodo;
  res.json(updatedTodo);
});

// DELETE /todos/:id - Delete a todo
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(todoIndex, 1);
  res.status(204).send();
});

export default router;
