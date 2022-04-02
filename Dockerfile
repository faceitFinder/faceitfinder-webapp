FROM node:17.8.0

ENV WEB /usr/src/webapp

RUN mkdir -p $WEB
WORKDIR $WEB

COPY ./app/package.json $WEB
RUN npm install

COPY ./app $WEB

EXPOSE 8080

CMD ["npm","start"]