#
# Frontend
#
FROM node:21-alpine as frontend

WORKDIR /app

COPY ./frontend/package.json ./frontend/yarn.lock ./

RUN yarn install

COPY ./frontend .

RUN yarn build

#
# Backend
#
FROM node:21-alpine as backend

WORKDIR /app

COPY ./backend/package.json ./backend/yarn.lock ./

RUN yarn install

COPY ./backend .

COPY --from=frontend /app/dist ./public

RUN chmod +x ./wait-for-db.sh
# RUN ./wait-for-db.sh mongo 27017

# Populate the database
# RUN yarn populate:cities
# RUN yarn populate:news

EXPOSE 3000

# "-c", "yarn", "populate:cities", "&&", "yarn", "populate:news", "&&", "yarn", "start"

CMD ["yarn", "start"]
