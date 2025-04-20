#!/bin/bash
yarn cache clean
rm -rf node_modules yarn.lock

for dir in client server shared
do
 cd ${dir} || exit
 yarn cache clean
 rm -rf node_modules yarn.lock
 cd ..
done

yarn install

for dir in client server shared
do
 cd ${dir} || exit
 yarn install
 cd ..
done
