import { Router } from "express";
import * as cartController from "../controllers/cart.controller";

const router = Router();

router.get("/", cartController.getCart);
// 프론트엔드의 fetch("/api/cart", { method: "POST" })와 맞추기 위해 경로를 "/"로 수정
router.post("/", cartController.addToCart); 
router.patch("/:id", cartController.updateCartItem);
router.delete("/:id", cartController.deleteCartItem);

export default router;