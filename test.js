import { Reqwu } from "./index.js";
let req;

// Create get request
req = new Reqwu("https://httpbin.org/get", "get");
const get = await req.header("accept", "application/json").send();
console.log(await get.json());

// Create get request but add headers at third parameter when inheriting a new Reqwu class
req = new Reqwu("https://httpbin.org/get", "get", {
    "user-agent": "reqwu",
    "accept": "application/json",
    "hi": "this is custom",
});
const getnw = await req.send();
console.log(await getnw.json());

// Create post request
req = new Reqwu("https://httpbin.org/post", "post");
const post = await req.body({
    "key": "value"
}, "json")
.header("user-agent", "reqwu").send();
console.log(await post.json());


// Create a patch request
req = new Reqwu("https://httpbin.org/patch", "patch");
const patch = await req.body({
    // Patch is just like post, but unlike post which only create new key value like data structure,
    // patch can modify a specific value or data partially. Depends on usage.
    "woo": "heart",
    "key": "invalid",
}, "json").send();


console.log(await patch.json());

console.log(req.status);
