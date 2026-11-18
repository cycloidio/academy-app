# academy-app

The sample web application of the Cycloid Academy missions. It shows a message, the commit its image was built from
and the environment it runs in, so you can see each change you push reach the running application.

## What is in this repository

| Path | What it is |
|---|---|
| `src/` | The application: Node.js, no dependency |
| `test/` | Its unit tests (`node:test`) |
| `Dockerfile` | The image: official Node.js LTS image pinned by digest, runs as a non-root user |
| `chart/academy-app/` | The Helm chart that deploys it on Kubernetes |
| `.github/workflows/ci.yml` | The CI: tests, then publishes the image and the chart to GitHub Packages |

## What the CI does

On every push, to any branch:

1. Runs the unit tests.
2. Builds the image and publishes it as `ghcr.io/<owner>/<repository>:<commit>`.
3. Packages the chart and publishes it as `oci://ghcr.io/<owner>/charts/academy-app`, version `0.1.0-g<commit>`. That
   chart version deploys the image of the same commit.

It needs no secret or variable: it uses the token GitHub gives every run.

## Run it on your machine

```bash
node --test
```

```bash
docker build --target runtime --build-arg COMMIT=local -t academy-app:local .
```

```bash
docker run --rm -p 8080:8080 -e ENVIRONMENT=dev academy-app:local
```

Then open http://localhost:8080/.

## Settings

| Variable | Default | Meaning |
|---|---|---|
| `MESSAGE` | `Hello from Cycloid Academy` | The title of the page |
| `ENVIRONMENT` | `unknown` | The environment name shown on the page |
| `COMMIT` | set at build time | The commit the image was built from |
| `PORT` | `8080` | The port the app listens on |
