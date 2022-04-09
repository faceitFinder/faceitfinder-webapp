# faceitfinder-webapp

# Start containers

## Dev
```
docker-compose -f docker-compose.dev.yml up
docker exec -it faceitfinder-webapp_webapp_1 npm run tailwind
```
### Access it
[localhost:8080](http://localhost:8080)

## Prod
Change `faceitfinder.*` to your domain in data/app.conf

```
chmod +x init-letsencrypt.sh
sudo ./init-letsencrypt.sh
```

```
docker-compose -f docker-compose.prod.yml up
```
### Access it
https://yourserverip
