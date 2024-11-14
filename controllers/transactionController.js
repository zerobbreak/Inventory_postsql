const pool = require("../config/db");

// Get all transactions (admin only)
exports.getAllTransactions = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT * FROM transactions
      `);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT * FROM transactions WHERE id = $1
      `, [req.params.id]);

        if (result.rows.length === 0) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a transaction
exports.createTransaction = async (req, res) => {
    try {
        const { orderId, transactionDate, amount, userId } = req.body;
        await pool.query(`
        INSERT INTO transactions (orderId, transactionDate, amount, userId)
        VALUES ($1, $2, $3, $4)
      `, [orderId, transactionDate, amount, userId]);

        res.status(201).json({ message: 'Transaction created' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
    try {
        const { amount } = req.body;
        const result = await pool.query(`
        UPDATE transactions SET amount = $1 WHERE id = $2
      `, [amount, req.params.id]);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json({ message: 'Transaction updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const result = await pool.query(`
        DELETE FROM transactions WHERE id = $1
      `, [req.params.id]);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Transaction not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
