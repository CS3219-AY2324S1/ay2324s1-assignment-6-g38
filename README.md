[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/UxpU_KWG)

![Code Quality Tests](https://github.com/CS3219-AY2324S1/ay2324s1-assignment-6-g38/actions/workflows/lint.yml/badge.svg)
![Functional Tests](https://github.com/CS3219-AY2324S1/ay2324s1-assignment-6-g38/actions/workflows/test.yml/badge.svg)

# Quick Start Guide
Our development setup revolves around Docker, where all backend services are dockerised in a single `docker-compose`. This setup allows for hot-reloading as well, as the containers are setup with volumes that point to the respective directories. This means that if a file changes in the directory, it will be reflected within the container as they are pointing to the same files. As such, we have to do the necessary setups for each service before running the containers. This setup could include installing dependencies, setting up the database clients, etc. For this, we have defined convenience scripts for the ease of setup.

The frontend does not support containerisation due to certain quirks with Next.js 13, thus you can run it standalone in your terminal.

## Setup root dependencies
The root `package.json` defines some convenience scripts that we will be using during development. To set them up, we have to install the root dependencies first.
```
npm install
```

## Setup all services
We automate `npm i` in all services through a convenience script that can be used in the root directory. This runs `npm i` in all of the microservices concurrently, and runs post-scripts i.e. `postinstall` in all of them as well to setup the databases, etc.
```
npm run install:services
```

## Setup Frontend
1. Navigate to `services/frontend`.
   
   ```
   cd frontend
   ```
2. Create a `.env` with the following attributes
    ```
   NEXT_PUBLIC_SERVICE_USER_URL=localhost:2001
   NEXT_PUBLIC_SERVICE_QUESTION_URL=localhost:5001
   NEXT_PUBLIC_SERVICE_HISTORY_URL=localhost:1001
   NEXT_PUBLIC_GITHUB_ClIENT_ID=/** fill this in */
   NEXT_PUBLIC_GITHUB_CLIENT_SECRET=/** fill this in */
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=/** fill this in */
    ```

## Start all services
The following command requires Docker (we recommend installing [Docker Desktop](https://www.docker.com/products/docker-desktop/)). This command will spin up the containers defined in the `docker-compose.dev.yml`, as well as running the frontend.
1. Run all services
```
npm run dev
```
2. Go to `http://localhost:3000` on your browser to access the frontend.
3. If you encounter any odd issues, check that all of your containers are running via Docker Desktop

# Troubleshooting
## Docker
If you encounter any issues with the containers, we have defined convenience scripts to remove the volumes, prune them, etc.
```
/** in root directory */

// stops all running containers
npm run stop

// restarts the containers
npm run restart

// removes the volumes attached to the containers and stops them
npm run cleanup
```
