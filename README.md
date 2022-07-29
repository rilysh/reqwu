## Reqwu
Very small HTTP/S request library for Node.js

## Info
- It uses Node.js native HTTP/S modules for performing the request
- Lightweight, doesn't use anything else
- Support headers
- Simple and minimal, best for creating simple HTTP/S request

## Installation
- It's recommended to use this directly from GitHub 
```sh
# NPM will spawn git CLI to clone the repo, make sure you've git installed on your system
npm install https://github.com/kiwimoe/reqwu.git
# After done, now you can use `import { Reqwu } from "reqwu";`
```

## Usage
#### Get request
Here are some basic examples, see [this](https://github.com/kiwimoe/reqwu/blob/main/test.js) test script.

```js
import { Reqwu } from "./index.js";

const req = new Reqwu("https://httpbin.org/get", "get");
const get = await req.send();
console.log(await get.json());
```

#### Get request with headers
```js
import { Reqwu } from "./index.js";

const req = new Reqwu("https://httpbin.org/get", "get", {
    "user-agent": "reqwu",
    "accept": "application/json",
    "hi": "this is custom",
});
const getnw = await req.send();
console.log(await getnw.json());
```

#### Post request
```js
req = new Reqwu("https://httpbin.org/post", "post");
const post = await req.body({
    "key": "value"
}, "json")
.header("user-agent", "reqwu").send();
console.log(await post.json());
```
