FROM node:20-slim as builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV WORKDIR=/fyp_web

WORKDIR $WORKDIR

COPY ./ $WORKDIR/

ARG version
ENV COMMITID=$version

RUN pnpm install
RUN pnpm run build

FROM nginx:alpine as prod

RUN mkdir /fyp_web

COPY --from=builder /fyp_web/dist /fyp_web
COPY --from=builder /fyp_web/docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
