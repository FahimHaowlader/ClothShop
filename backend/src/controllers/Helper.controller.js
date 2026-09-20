// single image upload
// single image delete
// multiple image upload
// multiple image delete
// only manager and admin can upload and delete images

export const uploadSingleImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteSingleImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const imageUrls = req.files.map(file => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      imageUrls,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMultipleImages = async (req, res) => {
  try {
    const { filenames } = req.body; // Expecting an array of filenames in the request body

    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({ success: false, message: "No filenames provided" });
    }

    const deletedFiles = [];
    const notFoundFiles = [];

    filenames.forEach(filename => {
      const filePath = `uploads/${filename}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deletedFiles.push(filename);
      } else {
        notFoundFiles.push(filename);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Images deletion process completed",
      deletedFiles,
      notFoundFiles,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};