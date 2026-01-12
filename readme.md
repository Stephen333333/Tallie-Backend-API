# Tallie Backend API

**Tallie Backend API** is a small **Express + TypeScript** REST API for managing **Restaurants**, **Tables**, and **Reservations** with business-rule validation and soft deletes.

---

## Quick Start

### Prerequisites

- **Node.js** (v16+ recommended)
- **npm**
- **MongoDB**

  - Local MongoDB instance **or**
  - Hosted MongoDB connection (provided via email)

---

### Install & Run (Development)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a `.env` file** in the project root:

   ```env
   DATABASE="mongodb://localhost:27017/tallie"; a hosted database url is provided in the email
   PORT=8100
   ```

   | Variable   | Description                                                                                    |
   | ---------- | ---------------------------------------------------------------------------------------------- |
   | `DATABASE` | MongoDB connection string (**required**) you can use the hosted database provided in the email |
   | `PORT`     | Server port (**required**)                                                                     |

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Uses **nodemon + ts-node** for hot reloading.

---

### Helpful Scripts

| Script                 | Description                    |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Development server             |
| `npm run build`        | Compile TypeScript to `build/` |
| `npm run start:server` | Run compiled server            |
| `npm run tscTest`      | TypeScript type-check only     |

---

## Server Basics

- **Base API prefix:** `/api`
- **Health check:**
  `GET /health` → `200 OK`

### Standard JSON Response Shape

```json
{
  "success": true,
  "result": null,
  "message": "Optional message"
}
```

---

## Routes & Payloads

All routes are prefixed with `/api/*`

### HTTP Status Codes

| Code  | Meaning                                 |
| ----- | --------------------------------------- |
| `201` | Created                                 |
| `200` | OK                                      |
| `400` | Validation error                        |
| `404` | Not found                               |
| `409` | Conflict (e.g. overlapping reservation) |

---

## Restaurant

### Create Restaurant

**POST** `/api/restaurant/create`

#### Request Body

```json
{
  "name": "Stephen's Test Restaurant",
  "address": "123 Victoria Island, Lagos",
  "phone": "555-1111",
  "email": "info@stephenstest.com",
  "website": "https://stephenstest.example",
  "openingHours": {
    "monday": {
      "openingTime": 540,
      "closingTime": 1320,
      "isClosed": false
    },
    "tuesday": {
      "openingTime": 540,
      "closingTime": 1320,
      "isClosed": false
    },
    "sunday": {
      "isClosed": true
    }
  }
}
```

#### Notes

- `openingTime` / `closingTime` are **minutes from midnight** (`0–1439`)
- Days must be **lowercase full names** (`monday`, `tuesday`, etc.)

---

### Other Restaurant Routes

- **GET** `/api/restaurant/read/:id`
- **PATCH** `/api/restaurant/update/:id`
  _(Partial updates allowed)_
- **DELETE** `/api/restaurant/delete/:id`
  _(Soft delete: `removed = true`)_

---

## Table

### Create Table

**POST** `/api/table/create`

```json
{
  "restaurantId": "60f7a2cd9f1b2c001234abcd",
  "tableNumber": 5,
  "capacity": 4
}
```

#### Notes

- `restaurantId` must be a MongoDB ObjectId string

### Other Table Routes

- **GET** `/api/table/read/:id`
- **PATCH** `/api/table/update/:id`
- **DELETE** `/api/table/delete/:id` _(soft delete)_

---

## Reservation

### Create Reservation

**POST** `/api/reservation/create`

```json
{
  "restaurantId": "60f7a2cd9f1b2c001234abcd",
  "tableId": "60f7a3ef9a7b3c001234ef12",
  "customerName": "Kemi",
  "customerPhone": "555-2222",
  "customerEmail": "kemi@example.com",
  "partySize": 3,
  "startTime": "2026-01-20T18:00:00.000Z",
  "endTime": "2026-01-20T19:30:00.000Z"
}
```

### Business Rules & Validation

- `startTime < endTime`
- Reservation **must not span multiple calendar days**
- Restaurant must be **open on the reservation day**
- Reservation times must be within opening/closing hours
- Table capacity ≥ `partySize`
- Overlapping reservations (non-cancelled/completed) → **409 Conflict**

---

### Other Reservation Routes

- **GET** `/api/reservation/read/:id`

- **PATCH** `/api/reservation/update/:id`

  Allowed `status` values:

  ```
  pending | confirmed | completed | cancelled
  ```

- **DELETE** `/api/reservation/delete/:id` _(soft delete)_

---

## Example `curl` Request

```bash
curl -X POST http://localhost:8100/api/restaurant/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Diner",
    "address": "123 Main St",
    "phone": "555-1111",
    "email": "info@mydiner.com",
    "website": "https://mydiner.example",
    "openingHours": {
      "monday": {
        "openingTime": 540,
        "closingTime": 1320,
        "isClosed": false
      }
    }
  }'
```

---

## Notes & Tips

- MongoDB **must be running**
- ISO date strings are accepted for all timestamps
- All deletes are **soft deletes**
- Payload validation happens at both **controller & model level**

---

---

## Postman Collection

```json
{
  "info": {
    "name": "Tallie Backend API",
    "description": "Postman collection for the Tallie Backend API (Restaurants, Tables, Reservations)",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8100",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Health",
      "item": [
        {
          "name": "Health Check",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/health",
              "host": ["{{baseUrl}}"],
              "path": ["health"]
            }
          }
        }
      ]
    },
    {
      "name": "Restaurant",
      "item": [
        {
          "name": "Create Restaurant",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Stephen's Test Restaurant\",\n  \"address\": \"123 Victoria Island, Lagos\",\n  \"phone\": \"555-1111\",\n  \"email\": \"info@stephenstest.com\",\n  \"website\": \"https://stephenstest.example\",\n  \"openingHours\": {\n    \"monday\": {\n      \"openingTime\": 540,\n      \"closingTime\": 1320,\n      \"isClosed\": false\n    },\n    \"sunday\": {\n      \"isClosed\": true\n    }\n  }\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/restaurant/create",
              "host": ["{{baseUrl}}"],
              "path": ["api", "restaurant", "create"]
            }
          }
        },
        {
          "name": "Read Restaurant",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/restaurant/read/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "restaurant", "read", ":id"]
            }
          }
        },
        {
          "name": "Update Restaurant",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"phone\": \"555-9999\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/restaurant/update/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "restaurant", "update", ":id"]
            }
          }
        },
        {
          "name": "Delete Restaurant",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{baseUrl}}/api/restaurant/delete/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "restaurant", "delete", ":id"]
            }
          }
        }
      ]
    },
    {
      "name": "Table",
      "item": [
        {
          "name": "Create Table",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"restaurantId\": \"60f7a2cd9f1b2c001234abcd\",\n  \"tableNumber\": 5,\n  \"capacity\": 4\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/table/create",
              "host": ["{{baseUrl}}"],
              "path": ["api", "table", "create"]
            }
          }
        },
        {
          "name": "Read Table",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/table/read/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "table", "read", ":id"]
            }
          }
        },
        {
          "name": "Update Table",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"capacity\": 6\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/table/update/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "table", "update", ":id"]
            }
          }
        },
        {
          "name": "Delete Table",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{baseUrl}}/api/table/delete/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "table", "delete", ":id"]
            }
          }
        }
      ]
    },
    {
      "name": "Reservation",
      "item": [
        {
          "name": "Create Reservation",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"restaurantId\": \"60f7a2cd9f1b2c001234abcd\",\n  \"tableId\": \"60f7a3ef9a7b3c001234ef12\",\n  \"customerName\": \"Kemi\",\n  \"customerPhone\": \"555-2222\",\n  \"customerEmail\": \"kemi@example.com\",\n  \"partySize\": 3,\n  \"startTime\": \"2026-01-20T18:00:00.000Z\",\n  \"endTime\": \"2026-01-20T19:30:00.000Z\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/reservation/create",
              "host": ["{{baseUrl}}"],
              "path": ["api", "reservation", "create"]
            }
          }
        },
        {
          "name": "Read Reservation",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/reservation/read/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "reservation", "read", ":id"]
            }
          }
        },
        {
          "name": "Update Reservation",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"confirmed\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/reservation/update/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "reservation", "update", ":id"]
            }
          }
        },
        {
          "name": "Delete Reservation",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{baseUrl}}/api/reservation/delete/:id",
              "host": ["{{baseUrl}}"],
              "path": ["api", "reservation", "delete", ":id"]
            }
          }
        }
      ]
    }
  ]
}
```

---
