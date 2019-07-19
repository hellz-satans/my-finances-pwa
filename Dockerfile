FROM node:10.13-alpine

RUN apk add --no-cache \
      git \
      git-subtree \
      openssh \
      openssh-client

RUN git config --global user.name "DID - Docker Image Deploy"
RUN git config --global user.email "auto@deploy.com"

ENTRYPOINT [ "npm" ]
ENV APP_PATH /usr/src/app
EXPOSE 8000
EXPOSE 8080
VOLUME [ "${APP_PATH}" ]

WORKDIR $APP_PATH

ADD ./public/ $APP_PATH/public/
ADD ./src/ $APP_PATH/src/
ADD ./babel.config.js $APP_PATH/babel.config.js
ADD ./deploy $APP_PATH/deploy
ADD ./LICENSE $APP_PATH/LICENSE
ADD ./package-lock.json $APP_PATH/package-lock.json
ADD ./package.json $APP_PATH/package.json
ADD ./README.md $APP_PATH/README.md
ADD ./vue.config.js $APP_PATH/vue.config.js

RUN npm install

CMD [ "install", "run", "serve" ]
