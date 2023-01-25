prod:
	docker compose down --volumes && \
	docker compose up --build

dev:
	docker compose down --volumes && \
	docker compose \
	-f docker-compose.yml \
	-f docker-compose.dev.yml \
	up --build