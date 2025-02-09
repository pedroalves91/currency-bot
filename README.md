<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

```
Bot to monitor if the price, of a set of currency pairs,
undergoes a change of a specified threshold percent in either direction
```

## Project setup

```bash
# install dependencies
$ npm install

# set parameters in .env file
create a .env file in the root of the project
and set the same parameters as in the .env.example file
```

## Compile and run the project

```bash
# start Postgres DB and start app
$ docker compose up -d && npm run start

# watch mode
$ docker compose up -d && npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test
```

