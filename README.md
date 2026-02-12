# Web Frontend

React + Vite + Tailwind CSS frontend that connects to the Go backend server.

## How It Works

- Fetches `GET /data` from the backend on load to display current `name` and `message`.
- Sends `PATCH /data` with updated fields when you click Save.
- The backend URL is configured via `VITE_API_URL` env var (defaults to `http://localhost:8080`).

> **Note:** Vite bakes `VITE_*` env vars at **build time**, not runtime. So the API URL is embedded into the JS bundle during `pnpm build`.

## Local Development

```bash
# Copy env and configure
cp .env.example .env

# Install dependencies
pnpm install

# Run dev server (connects to localhost:8080 by default)
pnpm dev
```

Make sure the backend server is running on port 8080.

## Docker

### Build

```bash
docker build -t web-frontend .
```

### Run

```bash
docker run -p 3000:80 web-frontend
```

The frontend is served by nginx on port 80 inside the container.

### Push to Docker Hub

```bash
# Tag with your Docker Hub username
docker tag web-frontend <your-dockerhub-username>/web-frontend:latest

# Push
docker push <your-dockerhub-username>/web-frontend:latest
```

## Kubernetes (via Helm + ArgoCD)

We deploy this using a **Helm chart** managed by **ArgoCD**. The actual manifests will be templated by Helm, but the expected rendered output looks something like this:

```yaml
# Expected output from Helm chart
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web-frontend
  template:
    metadata:
      labels:
        app: web-frontend
    spec:
      containers:
        - name: web-frontend
          image: <your-dockerhub-username>/web-frontend:latest
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: web-frontend
spec:
  selector:
    app: web-frontend
  ports:
    - port: 80
      targetPort: 80
```

Since `VITE_API_URL` is baked at build time, you have two options for connecting to the backend in K8s:

1. **Build with the right URL** — `docker build --build-arg VITE_API_URL=http://<backend-ingress-url> .`
2. **Use an Ingress** to route `/api` to the backend and `/` to the frontend, so the frontend can call a relative path.
