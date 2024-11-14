const pool = require("../config/db");
const { getSupplierById } = require("./supplierController");

const getAllItems = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM items");
        res.render("item_list", { items: result.rows });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error: fetching all the items from the database");
    }
}

const getItemByID = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT items.*, suppliers.name AS supplier_name FROM items LEFT JOIN suppliers ON items.supplierid = suppliers.id WHERE items.id = $1", [id]
        );
        res.render("item_detail",
            {
                item: result.rows[0],
                supplier: {
                    name: result.rows[0].supplier_name
                }
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error: getting item by its ID");
    }
}

const renderItemForm = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch all categories and suppliers for dropdowns
        const categoriesResult = await pool.query("SELECT id, name FROM categories");
        const suppliersResult = await pool.query("SELECT id, name FROM suppliers");

        const categories = categoriesResult.rows;
        const suppliers = suppliersResult.rows;

        if (id) {
            // Fetch the item for editing if id is provided
            const itemResult = await pool.query("SELECT * FROM items WHERE id = $1", [id]);

            if (itemResult.rows.length === 0) {
                return res.status(404).send("Item not found");
            }

            const item = itemResult.rows[0];
            res.render("item_form", { item, categories, suppliers });
        } else {
            // For creating a new item, render the form with null item
            res.render("item_form", { item: null, categories, suppliers });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error: unable to render item form");
    }
};


const createItem = async (req, res) => {
    const { name, description, price, stock, categoryid, supplierid } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO items (name, description, price, stock, categoryid, supplierid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, description, price, stock, categoryid, supplierid]
        );
        res.redirect(`/items/${result.rows[0].id}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server creating item");
    }
}

const updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, categoryid, supplierid } = req.body;

    
    try {
        const result = await pool.query(
            "UPDATE items SET name = $1, description = $2, price = $3, stock = $4, categoryid = $5, supplierid = $6 WHERE id = $7 RETURNING *",
            [name, description, price, stock, categoryid, supplierid, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Item not found");
        }
        console.log(name, description, price, stock, categoryid, supplierid);
        console.log(result);

        res.redirect(`/items/${result.rows[0].id}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error: Updating this item happened in the backend");
    }
}

const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM items WHERE id = $1", [id]);
        res.redirect("/items");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error: Deleting this item");
    }
}

module.exports = {
    getAllItems,
    getItemByID,
    renderItemForm,
    createItem,
    updateItem,
    deleteItem
}