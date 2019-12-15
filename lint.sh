#!/usr/bin/env bash
node_modules/.bin/eslint src/**.{ts,tsx} --fix
git checkout src/react-app-env.d.ts

