#!/bin/bash

if ! command -v node &> /dev/null
then
    echo "Node could not be found. Please install Node 14 or greater"
    exit
fi

if [[ $(node --version) != v14* ]] && [[ $(node --version) != v16* ]] ;
then
  echo "This repository was tested with Node 14 and Node 16, please use one of those"
  exit
fi

if ! command -v yarn &> /dev/null
then
    echo "The instructions for this workshop assume you have yarn installed, please install it"
    exit
fi

if ! command -v git &> /dev/null
then
  echo "This workshop assumes that you have git installed, please install it"
  exit
fi

if [ ! -f ./node_modules/.bin/typeorm ]; then
  echo "The next steps use typeorm to check for a database connection, please run 'yarn install' to install it"
  exit
fi

DATABASE=postgres ./node_modules/.bin/ts-node ./node_modules/.bin/typeorm query "SELECT 1 FROM pg_database" -d ./ormconfig.ts &> /dev/null
if [ $? -ne 0 ]; then
  echo "It looks like typeorm can't connect to postgres. Please check if you have a postgres database running on port 5432 and if the config in ormconfig.ts is correct"
  exit
fi

./node_modules/.bin/ts-node ./node_modules/.bin/typeorm query "SELECT schema_name FROM information_schema.schemata" -d ./ormconfig.ts &> /dev/null
if [ $? -ne 0 ]; then
  echo "It looks like you don't have a database called 'eventsourcing'. Please create it"
  exit
fi

./node_modules/.bin/ts-node ./node_modules/.bin/typeorm query "CREATE SCHEMA IF NOT EXISTS eventsourcing" -d ./ormconfig.ts > /dev/null
./node_modules/.bin/ts-node ./node_modules/.bin/typeorm query "CREATE SCHEMA IF NOT EXISTS projections" -d ./ormconfig.ts > /dev/null

echo "You have everything you need for this workshop!"
