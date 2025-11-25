# TraceFlow SDK

Official SDK for TraceFlow telemetry.

## Features
- **Automatic Telemetry**: Captures request/response details via Express middleware.
- **Buffering**: Batches events in memory to reduce network overhead.
- **Reliability**: Implements exponential backoff retries and atomic disk fallback for failed requests.
- **Configurable**: Easy configuration via options or environment variables.

## Installation

```bash
npm install traceflow-sdk
```

## Usage

### Basic Setup

```typescript
import express from 'express';
import { TraceFlowSDK, traceFlowMiddleware } from 'traceflow-sdk';

const app = express();

// Initialize SDK
const sdk = TraceFlowSDK({
  org_id: 'your-org-id',
  project_id: 'your-project-id',
  service_name: 'my-service',
  collector_url: 'https://api.traceflow.com/v1/ingest',
});

// Use Middleware
app.use(traceFlowMiddleware(sdk));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```

### Configuration

You can configure the SDK using the following options or environment variables:

| Option | Env Variable | Default | Description |
|--------|--------------|---------|-------------|
| `collector_url` | `TRACEFLOW_COLLECTOR_URL` | `http://localhost:3000/v1/ingest` | URL of the TraceFlow collector |
| `batch_size` | `TRACEFLOW_BATCH_SIZE` | `100` | Number of events to buffer before flushing |
| `flush_interval_ms` | `TRACEFLOW_FLUSH_INTERVAL_MS` | `2000` | Time in ms to wait before flushing buffer |
| `enable_disk_fallback` | `TRACEFLOW_ENABLE_DISK_FALLBACK` | `true` | Enable saving to disk on failure |

## Publishing

To publish this package to npm:

1.  **Login to NPM**:
    ```bash
    npm login
    ```

2.  **Publish**:
    ```bash
    npm run publish
    ```

## Versioning and Publishing Updates

To update the SDK version and publish a new release:

1.  **Commit your changes**: Ensure all changes are committed to git.
2.  **Update Version**: Run one of the following commands to update the version in `package.json` and create a git tag:
    ```bash
    npm version patch # 1.0.0 -> 1.0.1 (Bug fixes)
    npm version minor # 1.0.0 -> 1.1.0 (New features, backward compatible)
    npm version major # 1.0.0 -> 2.0.0 (Breaking changes)
    ```
3.  **Publish**:
    ```bash
    npm run publish
    ```

