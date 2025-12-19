# Frontend Deployment Guide

## Environment Variables

The frontend application uses environment variables to configure the backend API URL. This allows you to deploy the same Docker image to different environments (development, staging, production) without rebuilding.

### Configuration Priority

The API base URL is determined in the following order:

1. **Runtime Configuration** (via Docker): `window._env_.API_BASE_URL` - Set at container startup
2. **Build-time Configuration**: `REACT_APP_API_URL` - Set during `npm run build`
3. **Default Fallback**: `http://localhost:4000` - For local development

### Building the Docker Image

```bash
cd frontend
docker build -t my-frontend .
```

### Running the Container

#### Basic Usage (with default API URL)
```bash
docker run -p 8080:8080 my-frontend
```

#### With Custom API URL
```bash
docker run -p 8080:8080 \
  -e API_BASE_URL=http://your-backend-api.com \
  my-frontend
```

#### Example: Connecting to Backend Container
```bash
docker run -p 8080:8080 \
  -e API_BASE_URL=http://backend:4000 \
  my-frontend
```

#### Example: Production Deployment
```bash
docker run -p 8080:8080 \
  -e API_BASE_URL=https://api.yourdomain.com \
  my-frontend
```

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "8080:8080"
    environment:
      - API_BASE_URL=http://backend:4000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - MONGODB_URI=your_mongodb_connection_string
```

Then run:
```bash
docker-compose up
```

### Development Mode

For local development without Docker, you can set the environment variable:

```bash
# Linux/Mac
export REACT_APP_API_URL=http://localhost:4000
npm start

# Windows
set REACT_APP_API_URL=http://localhost:4000
npm start
```

Or create a `.env` file in the `frontend` directory:

```
REACT_APP_API_URL=http://localhost:4000
```

### Important Notes

1. **CORS Configuration**: Make sure your backend allows requests from your frontend domain
2. **HTTPS**: In production, use HTTPS URLs for the API_BASE_URL
3. **No Trailing Slash**: Don't include a trailing slash in API_BASE_URL (e.g., use `http://api.com` not `http://api.com/`)
4. **Port**: The frontend container exposes port 8080 by default

### Troubleshooting

- **API calls failing**: Check that `API_BASE_URL` is correctly set by opening browser console and checking `window._env_`
- **CORS errors**: Ensure backend CORS settings allow your frontend domain
- **404 errors**: Verify the API_BASE_URL includes the correct protocol (http/https) and port

