# Backend Setup and Documentation

## Prerequisites

Ensure you have the following installed:

- **Node.js** (>= 14.x)
- **npm** (>= 6.x) or **yarn**
- **Docker** (optional, for running in a containerized environment)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository_url>
cd <repository_folder>
```

### 2. Install Dependencies
Run the following command to install the necessary packages:
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root of the project and configure the required environment variables. Use the `.env.example` file as a reference:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
- **PORT**: Port for the server to run (default: `3000`)
- **JWT_SECRET**: Secret key for JWT authentication
- **DB_URL**: Connection string for your database


## Running the Project

### Locally
To start the server locally, use:
```bash
npm run dev
```
The backend will run on `http://localhost:<PORT>` (default: `http://localhost:3000`).

### With Docker
If you prefer to run the backend in a Docker container:

1. Build the Docker image:
   ```bash
   docker build -t backend-app .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env backend-app
   ```

The backend will be available on `http://localhost:3000`.

## API Documentation

The backend includes a Swagger API documentation for testing and understanding available endpoints.

- After running the project, navigate to:
  ```
  http://localhost:3000/docs
  ```
  This will open the Swagger UI where you can explore the API.

## Available Scripts

### build
```bash
npm run build
```
Builds the application.

### Development
```bash
npm run dev
```
Runs the application in development mode with watch reloading.

### Production
```bash
npm run start
```
Builds and runs the application in production mode.
