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

echo "You have everything you need for this workshop!"
