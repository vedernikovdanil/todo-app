prod:
	docker compose down --volume && docker compose up --build

dev:
	docker compose down --volume && docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build