# faceitfinder-webapp

# Init
```
chmod +x init-letsencrypt.sh
sudo ./init-letsencrypt.sh
```

# Start containers
## Dev

```
docker-compose -f docker-compose.dev.yml up
```
### Access it
[localhost:8080](http://localhost:8080)

## Prod
Change `faceitfinder.bot.nu` to your domain in data/app.conf
```
docker-compose -f docker-compose.prod.yml up
```
### Access it
https://yourserverip