import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

export const viewAvailableItems = async (req: Request, res: Response) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM grocery_items WHERE quantity > 0');
    conn.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error viewing available grocery items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const bookItems = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    const conn = await pool.getConnection();

    await conn.beginTransaction();

    for (const item of items) {
      const { id, quantity } = item;
      const [rows] = await conn.query<RowDataPacket[]>('SELECT quantity FROM grocery_items WHERE id = ?', [id]);
      const availableQuantity = rows[0]?.quantity; 
      if (availableQuantity === undefined || availableQuantity < quantity) {
        await conn.rollback();
        conn.release();
        return res.status(400).json({ error: `Not enough quantity available for item with ID ${id}` });
      }

      await conn.query('UPDATE grocery_items SET quantity = quantity - ? WHERE id = ?', [quantity, id]);
    }

    await conn.commit();
    conn.release();
    res.status(200).json({ message: 'Grocery items booked successfully' });
  } catch (error) {
    console.error('Error booking grocery items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
