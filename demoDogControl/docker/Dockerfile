FROM node:16.17.0 as builder

ENV WORKDIR=/fyp_web

WORKDIR $WORKDIR

COPY ./ $WORKDIR/

ARG version
ENV COMMITID=$version

RUN npm install
RUN npm run build

FROM nginx:alpine as prod

RUN mkdir /fyp_web

COPY --from=builder /fyp_web/dist /fyp_web
COPY --from=builder /fyp_web/docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80