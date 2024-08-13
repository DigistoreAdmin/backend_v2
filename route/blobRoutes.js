const express = require("express");
const {
  uploadBlob,
  downloadBlob,
  updateBlob,
  deleteBlob,
} = require("../controller/blobController.js");

const router = express.Router();

// Define routes
router.post("/upload", uploadBlob);
router.get("/download/:blobName", downloadBlob);
router.post("/update/:blobName", updateBlob);
router.delete("/delete/:blobName", deleteBlob);

module.exports = router;
