const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.post("/", supplierController.createNewSupplier);
router.put("/:id", supplierController.updateSupplier);
router.delete("/:id", supplierController.deleteSupplier);

module.exports = router;