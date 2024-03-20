"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageInventory = exports.updateGroceryItem = exports.removeGroceryItem = exports.viewGroceryItems = exports.addGroceryItem = void 0;
const db_1 = require("../config/db");
// Add new grocery items to the system
const addGroceryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, quantity } = req.body;
        const conn = yield db_1.pool.getConnection();
        yield conn.query('INSERT INTO grocery_items (name, price, quantity) VALUES (?, ?, ?)', [name, price, quantity]);
        conn.release();
        res.status(201).json({ message: 'Grocery item added successfully' });
    }
    catch (error) {
        console.error('Error adding grocery item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.addGroceryItem = addGroceryItem;
// View existing grocery items
const viewGroceryItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield db_1.pool.getConnection();
        const [rows] = yield conn.query('SELECT * FROM grocery_items');
        conn.release();
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Error viewing grocery items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.viewGroceryItems = viewGroceryItems;
// Remove grocery items from the system
const removeGroceryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const conn = yield db_1.pool.getConnection();
        yield conn.query('DELETE FROM grocery_items WHERE id = ?', [id]);
        conn.release();
        res.status(200).json({ message: 'Grocery item removed successfully' });
    }
    catch (error) {
        console.error('Error removing grocery item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.removeGroceryItem = removeGroceryItem;
// Update details of existing grocery items
const updateGroceryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, quantity } = req.body;
        const conn = yield db_1.pool.getConnection();
        yield conn.query('UPDATE grocery_items SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, id]);
        conn.release();
        res.status(200).json({ message: 'Grocery item updated successfully' });
    }
    catch (error) {
        console.error('Error updating grocery item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateGroceryItem = updateGroceryItem;
// Manage inventory levels of grocery items
const manageInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Implement your logic here
});
exports.manageInventory = manageInventory;
