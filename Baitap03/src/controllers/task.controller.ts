import type { Request, Response } from "express";
import Task from "../models/task.model";
// GET /tasks
export const getAll = async (_: Request, res: Response) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
};
// GET /tasks/:id
export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: "Not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};
// POST /tasks
export const create = async (req: Request, res: Response) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json(err);
  }
};
// PUT /tasks/:id
export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const [rows, [updatedTask]] = await Task.update(req.body, {
      where: { id },
      returning: true,
    });
    if (!rows) return res.status(404).json({ message: "Not found" });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json(err);
  }
};
// DELETE /tasks/:id
export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const rows = await Task.destroy({ where: { id } });
    if (!rows) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json(err);
  }
};
