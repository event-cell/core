#!/bin/bash

CMD="yarn add -D prettier eslint-config-prettier eslint-plugin-prettier"
for a in cli-client client live-timing server shared
do
	cd ${a}
	${CMD}
	cd ..
done
