require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const UUID = require('uuid-1345');
const checkAuth = require('./checkAuth');

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

    // Replace spaces in fieldname with '-' and ensure no prefix is empty
    const sanitizedPrefix = file.fieldname
      ? file.fieldname.replace(/\s+/g, '-')
      : '';
    const prefix = sanitizedPrefix ? `${sanitizedPrefix}-` : ''; // Add '-' if prefix exists

    cb(null, prefix + uuid + ext); // Format nama file
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
app.post('/', checkAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `${baseUrl}/upload/${req.file.filename}`;
    res.json({ link: fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error while uploading file' });
  }
});

// Route for uploading multiple files
app.post('/files', checkAuth, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const fileUrls = req.files.map(
      (file) => `${baseUrl}/upload/${file.filename}`
    );
    res.json({ links: fileUrls });
  } catch (error) {
    res.status(500).json({ message: 'Server error while uploading files' });
  }
});

app.post('/multiple-fields', checkAuth, upload.any(), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const uploadedFiles = {};

    req.files.forEach((file) => {
      // Extract prefix from the filename (e.g., po_uuid.ext -> po)
      const prefix = file.filename.split('-')[0] || '';
      const fileUrl = `${baseUrl}/upload/${file.filename}`; // File URL

      if (!uploadedFiles[prefix]) {
        uploadedFiles[prefix] = [];
      }

      // Add file name and URL to the response
      uploadedFiles[prefix].push({
        document: prefix,
        originalName: file.originalname,
        fileName: file.filename,
        link: fileUrl,
      });
    });

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while uploading files' });
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
app.delete('/:fileName', checkAuth, (req, res) => {
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

// Route for deleting multiple files
app.delete('/multiple-files', checkAuth, (req, res) => {
  const { files } = req.body; // Expecting { files: ['fileName1', 'fileName2', ...] }
  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Files array is missing or invalid',
    });
  }

  const results = [];

  files.forEach((fileName) => {
    const filePath = path.join(mediaDirectory, fileName);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        results.push({
          fileName,
          status: 'success',
          message: 'File deleted successfully',
        });
      } catch (err) {
        results.push({
          fileName,
          status: 'error',
          message: err.message,
        });
      }
    } else {
      results.push({
        fileName,
        status: 'error',
        message: 'File not found',
      });
    }
  });

  res.json({
    message: 'File deletion process completed',
    results,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
