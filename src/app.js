// The page the missions check: a message, the commit the image was built from and the environment
// it runs in. No dependency: node:http only.

const escapeHtml = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

export function readConfig(env = process.env) {
  return {
    message: env.MESSAGE || 'Hello from Cycloid Academy',
    commit: env.COMMIT || 'unknown',
    environment: env.ENVIRONMENT || 'unknown',
  }
}

export function renderPage({ message, commit, environment }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>academy-app</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1rem; color: #1a1a2e; }
  h1 { font-size: 1.75rem; }
  dl { display: grid; grid-template-columns: max-content 1fr; gap: 0.5rem 1rem; }
  dt { font-weight: 600; }
  code { font-size: 1rem; }
</style>
</head>
<body>
<h1>${escapeHtml(message)}</h1>
<dl>
  <dt>Commit</dt><dd><code id="commit">${escapeHtml(commit)}</code></dd>
  <dt>Environment</dt><dd><code id="environment">${escapeHtml(environment)}</code></dd>
</dl>
</body>
</html>
`
}

export function handler(config) {
  const page = renderPage(config)
  return (req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { allow: 'GET, HEAD' }).end()
    } else if (path === '/healthz') {
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end('ok\n')
    } else if (path === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(page)
    } else {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('not found\n')
    }
  }
}
