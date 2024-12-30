# syntax=docker/dockerfile:1
FROM node:latest
WORKDIR /code
EXPOSE 8000
EXPOSE 5432
COPY . .
RUN npm install
CMD ["npm", "start"]