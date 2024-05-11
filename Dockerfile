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

EXPOSE 3000

CMD ["yarn", "start"]
