"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/admin.ts
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const router = express_1.default.Router();
router.post('/grocery', adminController_1.addGroceryItem);
router.get('/grocery', adminController_1.viewGroceryItems);
router.delete('/grocery/:id', adminController_1.removeGroceryItem);
router.put('/grocery/:id', adminController_1.updateGroceryItem);
router.post('/grocery/:id/inventory', adminController_1.manageInventory);
exports.default = router;
