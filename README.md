
> ℹ️ **_INFO_**  
> Redis runs on port 6379 by default. Make sure port 6379 on the host is not being used by another container, otherwise the port should be changed.

## Deploy with docker compose

```
go to the project root directory then run -->
docker-compose -f docker-compose-dev.yaml up -d --build

docker-compose ps
```

## Testing the app

After the application starts, navigate to `http://localhost:4500` in your web browser or run:

base_path - `http://localhost:4500`

sample cj api = `${base_path}/cj/api/v1/get-products/?pageNum=1`