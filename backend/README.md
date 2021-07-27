# Affinity API

API to serve app frontend.

## Development

### Setup

- npm install
- Create .env file and put credentials inside

### Start

```
npm run dev
```

## Deployment

## Setup

- npm install
- Create .env file and put credentials inside
- Make sure use proper branch

### Start

```
npm start
```

### Update and restart

```
git pull
pm2 restart backend
```

## Access

- 0.0.0.0:8080

## Config

- configuration located in /config folder
- config.json: global properties
- development.json: default environment config file

## Knex Migration CLI

- Create New migration
  knex migrate:make migration_name
- Migrate to the lastest migration
  DATABASE_NAME=Affinity knex migrate:latest
- Roll back last migration
  DATABASE_NAME=Affinity knex migrate:rollback
