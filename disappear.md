Deploy the backend:

`make backend`

Compile frontend

```
cd www
npx vite build --mode optimism-disappear
```

Deploy

```
./deploy-frontend.sh
```

Update

```
make chapters
./deploy-frontend.sh
make update-chapters
```
