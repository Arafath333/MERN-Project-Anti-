const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');

// Local disk storage upload (no Cloudinary)
const uploadImage = asyncHandler(async (req, res) => {
    // Since we removed multer, images are passed as base64 strings in the request body
    const { imageData, fileName } = req.body;

    if (!imageData) {
        res.status(400);
        throw new Error('No image data provided');
    }

    // Strip the data URI prefix
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const uniqueName = `${Date.now()}-${fileName || 'image.jpg'}`;
    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${uniqueName}`;
    res.json({ success: true, url, public_id: uniqueName });
});

const deleteImage = asyncHandler(async (req, res) => {
    const { public_id } = req.body;
    if (!public_id) { res.status(400); throw new Error('public_id required'); }

    const filePath = path.join(__dirname, '../uploads', public_id);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ success: true, message: 'Image deleted' });
});

module.exports = { uploadImage, deleteImage };
