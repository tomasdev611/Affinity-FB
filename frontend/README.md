# Affinity Web Application Front-end

This document contains instruction for development and deployment for Affinity Web Front-end

## Development

### Prerequisites

- Node version 8.x

### Instructions

```
- npm install
- npm start
```

## Deployment

We generate a production build of the application and serve the contents via Nginx or Apache.

### Prerequisites

- Node version 8.x
- Nginx or Apache (Currently Apache is used)
- Clone the repo in a folder and setup Nginx or Apache to point that folder

### Deployment instructions

- Git clone the repo.
- For Staging (Notice we have different setting in angular.json for prod and staging)

```
npmm run build-staging
```

- For Production

```
npm run build-prod
```
