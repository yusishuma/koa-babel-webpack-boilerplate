# VERSION 1.2.0
FROM node:5.8.0
MAINTAINER yusi "yusilovechina@icloud.com"
EXPOSE 3210
RUN pwd
COPY . .
RUN npm install pm2 -g
ENTRYPOINT ['pm2'] 
##start ./package.json --no-daemon
CMD ['start package.json']