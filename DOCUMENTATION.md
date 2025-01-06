

```markdown
# File Upload API Documentation

## Overview

This API allows users to upload, retrieve, and delete files such as images and PDFs. It provides secure file management with authentication using a bearer token.

---

## Base URL

```
http://<BASE_URL>:<PORT>
```

Replace `<BASE_URL>` with your server's address and `<PORT>` with the port number (default: `3002`).

---

## Authentication

All endpoints require a bearer token in the `Authorization` header. The token is defined in the `.env` file as `TOKEN_KEY`.

Example:

```
Authorization: Bearer <TOKEN_KEY>
```

---

## Endpoints

### 1. **Upload File**

- **URL**: `/`
- **Method**: `POST`
- **Headers**:
  - `Authorization`: `Bearer <TOKEN_KEY>`
- **Body** (form-data):
  - `file`: The file to be uploaded. Supported types: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`, `application/pdf`.
- **Response**:
  - **200 OK**:
    ```json
    {
      "link": "<file_url>"
    }
    ```
    - `link`: URL to the uploaded file.
  - **400 Bad Request**:
    ```json
    {
      "message": "No file uploaded"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized access"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Server error while uploading file"
    }
    ```

---

### 2. **Retrieve File**

- **URL**: `/upload/<file_name>`
- **Method**: `GET`
- **Description**: Access the uploaded file by its name.
- **Response**:
  - The file is returned as binary data if it exists.

---

### 3. **Delete File**

- **URL**: `/:fileName`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization`: `Bearer <TOKEN_KEY>`
- **Path Parameters**:
  - `fileName`: Name of the file to delete.
- **Response**:
  - **200 OK**:
    ```json
    {
      "status": "success",
      "message": "File deleted successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "status": "error",
      "message": "File name is missing"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized access"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "status": "error",
      "message": "File not found"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "status": "error",
      "message": "Error deleting file"
    }
    ```

---

## Error Handling

The API includes error-handling middleware to handle common errors, such as:

- **Multer-specific errors** (e.g., file type or size restrictions).
- **Other server errors**.

Response format for errors:

```json
{
  "message": "<error_message>"
}
```

---

## Environment Variables

The API requires the following `.env` file configuration:

```env
PORT=3002
TOKEN_KEY=<your_token_key>
BASE_URL=<your_base_url>
```

---

## Notes

- Uploaded files are stored in the `media/upload` directory.
- The server ensures the directory structure exists before handling file operations.
- Only specific MIME types are supported for file uploads.

---

## Example Usage

### Upload a File (cURL)

```bash
curl -X POST http://localhost:3002/ \
  -H "Authorization: Bearer <TOKEN_KEY>" \
  -F "file=@example.jpg"
```

### Delete a File (cURL)

```bash
curl -X DELETE http://localhost:3002/example.jpg \
  -H "Authorization: Bearer <TOKEN_KEY>"
```
```