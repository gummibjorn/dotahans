[![Build Status](https://travis-ci.org/gummibjorn/dotahans.svg?branch=master)](https://travis-ci.org/gummibjorn/dotahans)

# Dotahans

Dotahans is a collection of several features to improve
your Dota2 experience together with your friends.

* Messaging(Telegram for now) for started/ended matches
* Exclusive match analysis
* Dashboard for ongoing matches

Node application written in TypeScript. 

## Start

`npm install`

```
docker run -d -p 6379:6379 redis
npm start

# or, if nodemon is acting up, the ugly manual way you run each change:
rm -r dist && npm run build && node dist/server.js
```

## Test

`npm test`

