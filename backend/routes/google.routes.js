import express from "express";
import { googleLogin } from "../controllers/googleAuth.js";

const router = express.Router();

router.post("/", googleLogin);

export default router;
