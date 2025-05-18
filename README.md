# RSSchool NodeJS websocket task template

> Static http server and base task packages.
> By default WebSocket client tries to connect to the 3000 port.

## Installation

1. Clone/download repo
2. `npm install`

## Usage

**Development**

`npm run start:dev`

- App served @ `http://localhost:8181` with nodemon

**Production**

`npm run start`

- App served @ `http://localhost:8181` without nodemon

---

**All commands**

| Command             | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `npm run start:dev` | App served @ `http://localhost:8181` with nodemon    |
| `npm run start`     | App served @ `http://localhost:8181` without nodemon |

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.

npm install --save-dev typescript @types/node

npx tsc --init

npm install ws cross-env

npm install --save-dev @types/ws

Optional
npm install --save-dev prettier
npm install --save-dev eslint
npm install --save-dev @typescript-eslint/eslint-plugin
npm install --save-dev @typescript-eslint/parser
npm install --save-dev eslint-config-prettier
npm install --save-dev eslint-import-resolver-typescript
npm install --save-dev eslint-plugin-import
