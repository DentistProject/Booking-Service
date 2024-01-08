# Booking Service

This service handles the CRUD functionality regarding bookings.

# Setup

## Local installation

```
git clone git@git.chalmers.se:courses/dit355/2023/student-teams/dit356-2023-04/booking-service.git
```

For this service to work you will need to create a .env for all your enviroment variables. It should be stored in the root folder. For instructions on how to configure it please look at ".env.dist".

# Run locally
In root run:
```
cd server
npm install
npm start
```

# Docker

In root directory, run:
```
docker compose build
docker compose up -d
```