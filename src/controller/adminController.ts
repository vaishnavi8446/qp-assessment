import { Request, Response } from "express";
import { pool } from "../config/db";
import { RowDataPacket } from "mysql2";

export const addGroceryItem = async (req: Request, res: Response) => {
  try {
    const { name, price, quantity } = req.body;
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO grocery_items (name, price, quantity) VALUES (?, ?, ?)",
      [name, price, quantity]
    );
    conn.release();
    res.status(201).json({ message: "Grocery item added successfully" });
  } catch (error) {
    console.error("Error adding grocery item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const viewGroceryItems = async (req: Request, res: Response) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM grocery_items");
    conn.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error viewing grocery items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeGroceryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM grocery_items WHERE id = ?", [id]);
    conn.release();
    res.status(200).json({ message: "Grocery item removed successfully" });
  } catch (error) {
    console.error("Error removing grocery item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateGroceryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;
    const conn = await pool.getConnection();
    await conn.query(
      "UPDATE grocery_items SET name = ?, price = ?, quantity = ? WHERE id = ?",
      [name, price, quantity, id]
    );
    conn.release();
    res.status(200).json({ message: "Grocery item updated successfully" });
  } catch (error) {
    console.error("Error updating grocery item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const manageInventory = async (req: Request, res: Response) => {
  try {
    const { id, quantity } = req.body;
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      "SELECT quantity FROM grocery_items WHERE id = ?",
      [id]
    );
    const currentQuantity = rows[0]?.quantity;

    if (currentQuantity === undefined) {
      return res.status(404).json({ error: "Grocery item not found" });
    }

    const newQuantity = currentQuantity + quantity;

    const updateResult = await pool.query(
      "UPDATE grocery_items SET quantity = ? WHERE id = ?",
      [newQuantity, id]
    );
    if (updateResult) {
      res.status(200).json({ message: "Inventory updated successfully" });
    }
  } catch (error) {
    console.error("Error managing inventory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
