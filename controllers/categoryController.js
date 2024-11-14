const pool = require("../config/db");

const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categories");
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM categories WHERE id = $1", [id]); 
        res.json(result.rows[0]);
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}


const createCategory = async (req, res) => {
    const {name, description} = req.body;
    try {
        const result = await pool.query("INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *", 
            [name, description]
        );
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).send("Category with this name already exists.");
        } else {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
}

const updateCategory = async (req, res) => {
    const {id} = req.params;
    const {name, description} = req.body;

    try {
        const result = await pool.query("UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *", 
            [name, description, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
}

const deleteCategory = async (req, res) => {
    const {id } = req.params;
    try {
        await pool.query("DELETE FROM categories WHERE id = $1", [id]);
        res.send("Item deleted successfully");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");        
    }
}



module.exports = {
    getAllCategories,
    getCategoryById, 
    createCategory, 
    updateCategory,
    deleteCategory
}