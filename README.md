# Media Upload and Management Service

This project provides a simple media upload and management service using Node.js, Express, and Multer. It allows users to upload and delete files securely.

## Features

- **File Upload**: Upload files to the server using `multer`.
- **File Deletion**: Delete files from the server.
- **Static File Serving**: Serve static files from the `/media` directory.
- **Authorization**: Basic token-based authorization for upload and delete operations.

## Setup

### Prerequisites

- Node.js and npm installed on your machine.
- A `.env` file with the following content:

```
PORT=your_preferred_port
TOKEN_KEY=your_secret_token
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/media-upload-service.git
   cd media-upload-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and set your `PORT` and `TOKEN_KEY`.

### Running the Server

Start the server with the following command:

```bash
npm start
```

The server will start on the specified port, or default to port 3103 if not specified.

## API Endpoints

### 1. Upload File

- **Endpoint**: `POST /`
- **Headers**:
  - `Authorization`: `Bearer <TOKEN_KEY>`
- **Body**: `form-data`
  - `file`: The file to be uploaded.
- **Response**:
  - Success: `{ "link": "<file_url>" }`
  - Error: `{ "message": "Error message" }`

### 2. Delete File

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

## Security

- Ensure that the `TOKEN_KEY` is kept secure and not exposed to unauthorized users.
- The `/media` directory should be properly secured to prevent unauthorized access.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [UUID-1345](https://github.com/pine613/uuid-1345)
# simple-crd-file-multer-express
