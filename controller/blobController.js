const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

const containerName = "imagecontainer";
const blobService = azureStorage.createBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

// Upload a blob to Azure Blob Storage
exports.uploadBlob = (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const blobName = req.files.file.name;
  const stream = intoStream(req.files.file.data);
  const streamLength = req.files.file.data.length;

  blobService.createBlockBlobFromStream(
    containerName,
    blobName,
    stream,
    streamLength,
    (err) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Error uploading file", error: err });
      }
      res.status(200).send({ message: "File uploaded successfully" });
    }
  );
};

// Download a blob from Azure Blob Storage
exports.downloadBlob = (req, res) => {
  const blobName = req.params.blobName;

  blobService.getBlobToStream(containerName, blobName, res, (err) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error downloading file", error: err });
    }
  });
};

// Update/Replace a blob in Azure Blob Storage
exports.updateBlob = (req, res) => {
  console.log("Request received to update blob");
  console.log("Files:", req.files);
  console.log("Body:", req.body);

  if (!req.files || !req.files.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const file = req.files.file;
  const blobName = req.body.blobName || file.name;
  const stream = intoStream(file.data);
  const streamLength = file.data.length;

  console.log("Blob name:", blobName);
  console.log("Stream length:", streamLength);

  blobService.createBlockBlobFromStream(
    containerName,
    blobName,
    stream,
    streamLength,
    (err) => {
      if (err) {
        console.error("Error uploading blob:", err);
        return res
          .status(500)
          .send({ message: "Error updating file", error: err });
      }
      res.status(200).send({ message: "File updated successfully" });
    }
  );
};

// Delete a blob from Azure Blob Storage
exports.deleteBlob = (req, res) => {
  const blobName = req.params.blobName;

  blobService.deleteBlobIfExists(containerName, blobName, (err, result) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error deleting file", error: err });
    }
    if (result) {
      res.status(200).send({ message: "File deleted successfully" });
    } else {
      res.status(404).send({ message: "File not found" });
    }
  });
};
