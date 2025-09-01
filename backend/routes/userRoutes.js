import express from "express";
import { getUsers, createUser } from "../controller/user.controller.js";

const router = express.Router();

// GET all users
router.get("/", getUsers);

// POST new user
router.post("/", createUser);

export default router;
