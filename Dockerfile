# Official Node.js image, current LTS, pinned by digest (update both together).
FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS base
WORKDIR /app
COPY package.json ./
COPY src ./src

# `docker build --target test .` runs the unit tests; the CI does it before building the image.
FROM base AS test
COPY test ./test
RUN node --test

FROM base AS runtime
ARG COMMIT=unknown
ENV NODE_ENV=production \
    PORT=8080 \
    COMMIT=$COMMIT
# The `node` user of the official image: the app never runs as root.
USER node
EXPOSE 8080
CMD ["node", "src/server.js"]
