const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// Route to get all items
router.get("/", itemController.getAllItems);

// Route to render form for creating a new item
router.get("/new", itemController.renderItemForm);

// Route to get a specific item by its ID
router.get("/:id", itemController.getItemByID);

// Route to render form for editing an item
router.get("/:id/edit", itemController.renderItemForm); // Render the edit form for a specific item

// Route to create a new item (POST)
router.post("/", itemController.createItem);  // Changed to "/" to match the item creation route

// Route to update an existing item (PUT)
router.put("/:id", itemController.updateItem); // Update item via PUT method

// Route to delete an item
router.delete("/:id", itemController.deleteItem);

module.exports = router;
