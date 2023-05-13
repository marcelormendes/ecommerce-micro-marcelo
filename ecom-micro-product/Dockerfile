FROM node:12

WORKDIR /opt/app

RUN echo "building image..."

# Installing dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm  install --only=prod

ARG CI_ENV=noci
ARG GIT_COMMIT=git_commit_undefined
ARG GIT_BRANCH=git_branch_undefined
ARG APP_VERSION=not_versioned

ENV APP_HOST=localhost
ENV APP_PORT=3000
ENV APP_ENV=local
ENV APP_NAME=realworld
ENV APP_KEY=app_secret_key_undefined

ENV NODE_ENV=production
ENV LOG_LEVEL=info

ENV DB_HOST=127.0.0.1
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=ecom-product
ENV DB_TEST_NAME=ecom-product

RUN echo "version=$APP_VERSION" > /opt/app/version && echo "commit=$GIT_COMMIT" >> /opt/app/version && echo "branch=$GIT_BRANCH" >> /opt/app/version

RUN echo "APP_VERSION=$APP_VERSION" > /opt/app/.env
RUN cat /opt/app/.env

# Copying source files
COPY . .

# Building app
RUN npm build

EXPOSE 3000

# Running the app
CMD npm start
