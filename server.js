require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const UUID = require('uuid-1345');

const app = express();
const port = process.env.PORT || 3002;

const tokenKey = process.env.TOKEN_KEY;
const baseUrl = process.env.BASE_URL || 'localhost:3002';

app.use(cors());
app.use(express.json()); // for parsing application/json

// Ensure the /media directory exists
const mediaDirectory = path.join(__dirname, 'media', 'upload');
if (!fs.existsSync(mediaDirectory)) {
  fs.mkdirSync(mediaDirectory, { recursive: true });
}

// Serve static files from /media
app.use('/', express.static(path.join(__dirname, 'media')));

// Set storage with multer, save files in /media folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mediaDirectory); // Saving in /media folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timeStamp = Date.now().toString();
    const uuid = UUID.v5({
      namespace: UUID.namespace.url,
      name: timeStamp,
    });
    cb(null, uuid + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'application/pdf',
  ];

  if (allowedTypes?.includes(file?.mimetype?.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for file upload with error handling
app.post('/', upload.single('file'), (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${tokenKey}`) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const fileUrl = `${baseUrl}/upload/${req.file.filename}`;
    res.json({ link: fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error while uploading file' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // Other errors
    return res.status(500).json({ message: err.message });
  }
  next();
});

// Route for file deletion
app.delete('/:fileName', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${tokenKey}`) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  const { fileName } = req.params;
  if (!fileName) {
    return res.status(400).json({
      status: 'error',
      message: 'File name is missing',
    });
  }

  const filePath = path.join(mediaDirectory, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: err.message,
        });
      }
      res.json({
        status: 'success',
        message: 'File deleted successfully',
      });
    });
  } else {
    res.status(404).json({ status: 'error', message: 'File not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
