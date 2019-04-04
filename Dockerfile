FROM node:10.13-alpine

RUN apk add --no-cache \
      git \
      git-subtree \
      openssh

RUN git config --global user.name "DID - Docker Image Deploy"
RUN git config --global user.email "auto@deploy.com"

WORKDIR /app
EXPOSE 8080
