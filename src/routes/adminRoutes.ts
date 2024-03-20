import express from "express";
import { isAdmin } from "../middleware/role";
import {
  addGroceryItem,
  viewGroceryItems,
  removeGroceryItem,
  updateGroceryItem,
  manageInventory,
} from "../controller/adminController";

const router = express.Router();

router.post("/grocery", isAdmin, addGroceryItem);
router.get("/grocery", isAdmin, viewGroceryItems);
router.delete("/grocery/:id", isAdmin, removeGroceryItem);
router.put("/grocery/:id", isAdmin, updateGroceryItem);
router.post("/grocery/:id/inventory", isAdmin, manageInventory);

export default router;
