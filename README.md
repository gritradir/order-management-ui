# Order Management UI

Angular-based user interface for the Order Management System.

## Running with Docker

### Prerequisites
- Docker and Docker Compose installed
- Order Management API running (see note below)

This UI connects to the Order Management API service.
- Both services share the same network named `order_management_network`
- The API docker-compose file should have the following network configuration:
  ```yaml
  networks:
    order_management_network:
      name: order_management_network
  ```
UI would work without API running, but would indicate network error

### Using Docker

1. Start the UI:
```bash
docker-compose up --build -d
```

The UI will be available at http://localhost

## Local Development

```bash
npm install
ng serve
```

Access at http://localhost:4200