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
```
docker-compose -f docker-compose.prod.yml up
```
### Access it
https://yourserverip