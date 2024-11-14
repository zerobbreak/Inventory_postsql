const pool = require("../config/db");

// Get all orders (admin or authorized users)
exports.getAllOrders = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT orders.*, users.username 
        FROM orders 
        JOIN users ON orders.userId = users.id
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get order by ID
  exports.getOrderById = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM orders WHERE id = $1
      `, [req.params.id]);
  
      if (result.rows.length === 0) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Create a new order
  exports.createOrder = async (req, res) => {
    try {
      const { orderDate, status, userId, itemId, quantity } = req.body;
      await pool.query(`
        INSERT INTO orders (orderDate, status, userId, itemId, quantity)
        VALUES ($1, $2, $3, $4, $5)
      `, [orderDate, status, userId, itemId, quantity]);
      
      res.status(201).json({ message: 'Order created' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Update an order (e.g., status)
  exports.updateOrder = async (req, res) => {
    try {
      const { status } = req.body;
      const result = await pool.query(`
        UPDATE orders SET status = $1 WHERE id = $2
      `, [status, req.params.id]);
  
      if (result.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json({ message: 'Order updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete an order
  exports.deleteOrder = async (req, res) => {
    try {
      const result = await pool.query(`
        DELETE FROM orders WHERE id = $1
      `, [req.params.id]);
  
      if (result.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };