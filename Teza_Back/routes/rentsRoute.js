const express = require("express")
const router = express.Router()

const rentsController = require("../controllers/rentsController")

router.get("/rent", rentsController.getRents)
router.get("/rent/:id", rentsController.getRentByID)
router.post("/rent/add", rentsController.add)

module.exports = router