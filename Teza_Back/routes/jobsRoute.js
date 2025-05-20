const express = require("express")
const router = express.Router()

const jobsController = require("../controllers/jobsController")

router.get("/job", jobsController.getJobs)
router.post("/job/add", jobsController.add)
router.get("/job/:id", jobsController.getJobById)

module.exports = router