---

# 🐳 Docker Deployment Plan (Monolith – Hetzner)

## Step 1: Install Docker and Docker Compose

* SSH into your Hetzner server.
* Install Docker:

  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  ```
* Install Docker Compose:

  ```bash
  sudo apt install docker-compose -y
  ```

---

## Step 2: Write `Dockerfile` for Monolithic App

- Create a `Dockerfile` that:

  - Installs dependencies
  - Builds the Next.js app
  - Runs `server.js` to serve both frontend and WebSocket

---

## Step 3: Write `docker-compose.yml`

- Define services:

  - `app`: your monolithic Next.js + socket server
  - `db`: optional, if you're not using the existing PostgreSQL container

Example stub:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    restart: always
    env_file:
      - .env
    depends_on:
      - db
  db:
    image: postgres
    ...
```

---

## Step 4: Create `.env` File or Use Compose `environment` Block

- Define necessary environment variables (DB credentials, ports, secrets, etc.)
- Either:

  - Create a `.env` file and mount it
  - Use inline `environment:` block in Compose

---

## Step 5: Build and Run Containers

```bash
docker-compose up --build -d
```

- This builds the Docker image and starts the app in detached mode

---

## Step 6: Configure Nginx or Caddy (Optional)

- Reverse proxy requests to your app container
- Good idea if you want to:

  - Map `http://yourdomain.com` to `localhost:3000`
  - Add HTTPS later with Let's Encrypt

---

## Step 7: Verify Application

- In your browser, visit:

  ```
  http://<your-server-ip>:3000
  ```

- Ensure frontend loads and connects to the WebSocket backend

---

## Step 8: Enable Auto-Restart

- Add this to your `docker-compose.yml` under `app`:

  ```yaml
  restart: always
  ```

- Ensures the container restarts on crash or reboot

---

## Step 9: Set Up CI/CD (Optional)

- Use GitHub Actions or a simple script to:

  - Push changes to a remote repo
  - SSH into server → `git pull`, `docker-compose up --build -d`

- Or build/push Docker images to a registry and pull in production

---
