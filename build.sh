docker build --file=db.dockerfile -t sol_db .
docker build --file=listener.dockerfile -t sol_listener .

docker compose -f docker-compose.yml up -d