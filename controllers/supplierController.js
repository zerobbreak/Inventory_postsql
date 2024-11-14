const pool = require("../config/db");

const getAllSuppliers = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM suppliers");
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error: fetching suppliers");
    }
}

const getSupplierById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM suppliers WHERE id = $1", [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error: fetching supplier by id");
    }
}

const createNewSupplier = async (req, res) => {
    const {name, contactInfo } = req.body;
    try {
        const result = await pool.query("INSERT INTO suppliers (name, contactinfo) VALUES ($1, $2) RETURNING *", 
            [name, contactInfo]
        );
        res.json(result.rows[0]);
        res.send("Supplier created");
    } catch (error) {
        
    }
}

const updateSupplier = async (req, res) => {
    const {id} = req.params;
    const {name, contactInfo} = req.body;
    try {
        const result = await pool.query("UPDATE suppliers SET name = $1, contactinfo = $2 WHERE id = $3 RETURNING *", 
            [name, contactInfo, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error: supplier failed to update");
    }
}

const deleteSupplier = async (req, res) => {
    const {id} = req.params;
    
    try {
        await pool.query("DELETE FROM suppliers WHERE id = $1", [id]);
        res.send("Item deleted successfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error: deleting this supplier");
    }
}

module.exports = {
    getAllSuppliers, 
    getSupplierById, 
    createNewSupplier, 
    updateSupplier, 
    deleteSupplier
}