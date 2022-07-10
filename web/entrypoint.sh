#!/bin/bash

echo "Starting Application for Development"
npm install -g migrate-mongo
npm run migrate
npm run watch