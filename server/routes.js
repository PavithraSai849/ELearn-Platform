const express = require("express");
const multer = require("multer");
const fs = require("fs"); // Required to remove the temporary files after upload
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
  uploadFilesToCloudinary,
} = require("./cloudinary");

const router = express.Router();

// Multer configuration to handle video uploads
const upload = multer({ dest: "uploads/" });

// Single video upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("File path received:", req.file.path); 
    const result = await uploadMediaToCloudinary(req.file.path);
    // Remove temporary file after upload
    fs.unlinkSync(req.file.path);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error uploading video" });
  }
});

// Single video delete route
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Asset ID is required",
      });
    }

    await deleteMediaFromCloudinary(id);
    
    res.status(200).json({
      success: true,
      message: "Video deleted successfully from Cloudinary",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error deleting video" });
  }
});

// Bulk video upload route
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    // Remove temporary files after upload
    req.files.forEach((file) => fs.unlinkSync(file.path));
    
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (event) {
    console.error(event);
    res.status(500).json({ success: false, message: "Error in bulk uploading videos" });
  }
});


router.post("/upload-files", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("hello am in backend", filePath);
    const result = await uploadFilesToCloudinary(filePath);
    console.log("hello am in backend lets see result", result);
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});



// Single document upload route
router.post("/upload-document", upload.single("file"), async (req, res) => {
  try {
    console.log("File path received:", req.file.path); 
    const result = await uploadMediaToCloudinary(req.file.path);
      fs.unlinkSync(req.file.path); // Remove local temp file after upload
  
      res.status(200).json({
        success: true,
        data: {
          url: result.secure_url,  // Use the secure Cloudinary URL here
          public_id: result.public_id
        }
      });
    } catch (e) {
      console.error("Error in upload route:", e);
      res.status(500).json({ success: false, message: "Error uploading file" });
    }
  });



module.exports = router;
