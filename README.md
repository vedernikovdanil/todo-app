# BUILD

## production

```
docker compose down --volume && \
docker compose up --build
```

or

`make prod`

## development

```
docker compose down --volume && \
docker compose \
-f docker-compose.yml \
-f docker-compose.dev.yml \
up --build
```

or

`make dev`

# APPLICATION

## ADMIN

login: admin

password: admin

## USER

login: user

password: user
