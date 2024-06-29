1. cp .env.example .env
2. docker compose up -d
3. npm run dev

4. load configuration from endpoint using a request:
```bash
curl --location 'localhost:3000/api/config/save' \
--header 'Content-Type: application/json' \
--data '{
    "news": {
        "value": 1,
        "period": 86400
    }
}'
```

5. use service
```bash
curl --location 'localhost:3000/api/send-notification' \
--header 'Content-Type: application/json' \
--data '{
    "userId": 1,
    "notificationType": "news"
}'
```
