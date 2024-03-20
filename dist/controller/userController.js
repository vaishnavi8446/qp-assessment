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
exports.bookItems = exports.viewAvailableItems = void 0;
const db_1 = require("../config/db");
const viewAvailableItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield db_1.pool.getConnection();
        const [rows] = yield conn.query('SELECT * FROM grocery_items WHERE quantity > 0');
        conn.release();
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Error viewing available grocery items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.viewAvailableItems = viewAvailableItems;
const bookItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { items } = req.body;
        const conn = yield db_1.pool.getConnection();
        yield conn.beginTransaction();
        for (const item of items) {
            const { id, quantity } = item;
            const [rows] = yield conn.query('SELECT quantity FROM grocery_items WHERE id = ?', [id]);
            const availableQuantity = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.quantity; // Accessing the quantity property safely
            if (availableQuantity === undefined || availableQuantity < quantity) {
                yield conn.rollback();
                conn.release();
                return res.status(400).json({ error: `Not enough quantity available for item with ID ${id}` });
            }
            yield conn.query('UPDATE grocery_items SET quantity = quantity - ? WHERE id = ?', [quantity, id]);
        }
        yield conn.commit();
        conn.release();
        res.status(200).json({ message: 'Grocery items booked successfully' });
    }
    catch (error) {
        console.error('Error booking grocery items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.bookItems = bookItems;
