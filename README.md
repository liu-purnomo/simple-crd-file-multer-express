# Media Upload and Management Service

This project provides a simple media upload and management service using Node.js, Express, and Multer. It allows users to upload, manage, and delete files securely.

## Features

- **Single File Upload**: Upload individual files to the server.
- **Multiple File Upload**: Upload multiple files in one request.
- **Multiple Field File Upload**: Handle file uploads for different field names.
- **File Deletion**: Delete files securely from the server.
- **Static File Serving**: Serve static files from the `/media` directory.
- **Authorization**: Basic token-based authorization for all operations.
- **Error Handling**: Comprehensive error handling for unsupported file types and upload issues.

## Setup

### Prerequisites

- Node.js and npm installed on your machine.
- A `.env` file with the following content:

```
PORT=your_preferred_port
TOKEN_KEY=your_secret_token
BASE_URL=your_server_url
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/liu-purnomo/simple-crd-file-multer-express.git
   cd simple-crd-file-multer-express
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and set your `PORT`, `TOKEN_KEY`, and `BASE_URL`.

### Running the Server

Start the server with the following command:

```bash
npm start
```

The server will start on the specified port, or default to port 3103 if not specified.

## API Endpoints

### 1. Single File Upload

- **Endpoint**: `POST /`
- **Headers**:
  - `Authorization`: `Bearer <TOKEN_KEY>`
- **Body**: `form-data`
  - `file`: The file to be uploaded.
- **Response**:
  - Success: `{ "link": "<file_url>" }`
  - Error: `{ "message": "Error message" }`

### 2. Multiple File Upload

- **Endpoint**: `POST /files`
- **Headers**:
  - `Authorization`: `Bearer <TOKEN_KEY>`
- **Body**: `form-data`
  - `files`: Multiple files to be uploaded.
- **Response**:
  - Success: `{ "links": ["<file_url_1>", "<file_url_2>", ...] }`
  - Error: `{ "message": "Error message" }`

### 3. Multiple Field File Upload

- **Endpoint**: `POST /multiple-fields`
- **Headers**:
  - `Authorization`: `Bearer <TOKEN_KEY>`
- **Body**: `form-data`
  - Multiple fields, each containing one or more files.
- **Response**:
  - Success:
    ```json
    {
      "message": "Files uploaded successfully",
      "files": {
        "<fieldname>": [
          {
            "document": "<fieldname>",
            "originalName": "<original_file_name>",
            "fileName": "<saved_file_name>",
            "link": "<file_url>"
          }
        ]
      }
    }
    ```
  - Error: `{ "message": "Error message" }`

### 4. Delete File

- **Endpoint**: `DELETE /:fileName`
- **Headers**:
  - `Authorization`: `Bearer <TOKEN_KEY>`
- **Params**:
  - `fileName`: The name of the file to be deleted.
- **Response**:
  - Success: `{ "message": "File deleted successfully" }`
  - Error: `{ "message": "Error message" }`

## Folder Structure

- `media/`: Directory where uploaded files are stored.
- `index.html`: A sample HTML file served at the root route.
- `.env`: Environment variables (not included in the repository).

## Supported File Types

The following file types are allowed for upload:

- `image/png`
- `image/jpeg`
- `image/jpg`
- `image/webp`
- `application/pdf`

## Security

- Ensure that the `TOKEN_KEY` is kept secure and not exposed to unauthorized users.
- The `/media` directory should be properly secured to prevent unauthorized access.
- Set file upload limits and sanitize file names to avoid security vulnerabilities.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [UUID-1345](https://github.com/pine613/uuid-1345)
