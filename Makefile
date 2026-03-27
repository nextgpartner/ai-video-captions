.PHONY: dev prod test clean stop

dev:
	docker compose -f docker-compose.dev.yml up --build

prod:
	docker compose up --build -d

test:
	cd backend && PYTHONPATH=. python -m pytest tests/ -v

stop:
	docker compose down
	docker compose -f docker-compose.dev.yml down

clean:
	rm -rf backend/data/temp/* backend/data/output/*
