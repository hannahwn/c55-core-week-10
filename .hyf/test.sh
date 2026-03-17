#!/usr/bin/env bash

{
  pushd ..
  /usr/bin/env npm install
  npx vitest run --reporter=json --outputFile=.hyf/report.json
  popd || exit
} >/dev/null

PASSING_SCORE=50 /usr/bin/env node tester.js
