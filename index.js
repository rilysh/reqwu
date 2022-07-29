import http from "http";
import https from "https";
import zlib from "zlib";
import { Response } from "./reponse.js";

export class Reqwu {
    /**
     * Main constructor of Reqwu
     * @param url - Target URL  
     * @param method - State of the method, you want to use (optional, by default uses GET) 
     * @param headers - Extra headers (optional, can be added manually using header function)
     */
    constructor(url, method = "GET", headers) {
        this.url = new URL(url);
        this.method = method.toUpperCase();
        this.data = undefined;
        this.type = "json";
        this.headers = headers || {};
        this.rawcompress = false;
        this.wait = undefined;
        this.statuscode = undefined;

        if (!http.METHODS.includes(this.method)) {
            throw new TypeError("Invalid method");
        }
    }

    /**
     * Shows which URL is the target
     * @returns The URL where you're making the request
     */
    get whaturl() {
        return this.url.href;
    }

    /**
     * Shows the status code given by the server
     * @returns Status code
     */
    get status() {
        return this.statuscode;
    }

    /**
     * Optional function
     * URL path name, they're starts with "/""
     * @param name - Provide the path of the URL
     * @returns Provided path
     */
    path(name) {
        this.url.pathname = name;
        return this;
    }

    /**
     * Optional function
     * Set a port of the connection URL, for instance https://httpnim:443 (443 is the port) 
     * @param num - Port number 
     * @returns The port number 
     */
    port(num) {
        if (typeof num !== "number") {
            throw new TypeError(`Port function argument only take number, but provided argument is a ${typeof num}`);
        }
        this.url.port = num;
        return this;
    }

    /**
     * Optional function
     * Set content body, when doing POST or PATCH requests
     * @param data - Any kind of data, including JSON and buffers  
     * @param type - Specify the type of the first aargument, data 
     * @returns According the data type, will return JSON or buffer or form
     */
    body(data, type) {
        switch (type) {
            case "json":
                this.data = JSON.stringify(data);
                return this;
            case "buffer":
                this.data = Buffer.from(data);
                return this;
            case "form":
                this.data =  new URLSearchParams(data).toString();
                return this;
            default:
                throw new Error(`"${type}" isn't a valid data type format`);
        }
    }

    /**
     * Optional function
     * Manually append query to the URL before making the request
     * @param name - Query name, can be an object, use it like a key  
     * @param value - Provided query data according to the name/key 
     * @returns Updated URL with appended query
     */
    query(name, value) {
        if (typeof name === "object") {
            Object.keys(name).forEach((v) => {
                this.url.searchParams.append(v, name[v]);
            });
        }
        this.url.searchParams.append(name, value);
        return this;
    }

    /**
     * Optional function
     * Add header before making the request
     * @param data - Header name, can be an object, use it like a key 
     * @param value - Provided header value according to the name/key
     * @returns Updated header
     */
    header(data, value) {
        if (typeof data === "object") {
            Object.keys(value).forEach((v) => {
                this.headers[v.toLowerCase()] = data[v];
            })
        }
        this.headers[data.toLowerCase()] = value;
        return this;
    }

    /**
     * Optional function
     * Allow getting data from compressed files
     * @returns Updated accpt-encoding header, where Node will accept these compression formats (deflate, gzip, br)
     */
    compress() {
        this.rawcompress = true;
        if (!this.headers["accept-encoding"]) {
            this.headers["accept-encoding"] = "deflate, gzip, br";
        }
        return this;
    }

    /**
     * Set a timeout for a request to be destroyed
     * @param time - Timeout number in milliseconds 
     * @returns Timeout number
     */
    timeout(time) {
        if (typeof time !== "number") {
            throw new TypeError("Provided \"time\" must be a number");
        }
        this.wait = Number(time);
        return this;
    }

    /**
     * Send all information, which you included on headers and query, body data to the server 
     * @returns Promise, buffer data or an error
     */
    send() {
        return new Promise((resolve, reject) => {
            const options = {
                "protocol": this.url.protocol,
                "host": this.url.hostname,
                "port": this.url.port,
                "path": this.url.pathname + this.url.search,
                "method": this.method,
                "headers": this.headers
            };
            const module = this.url.protocol === "https:" ? https : http;
            const req = module.request(options, (res) => {
                if (this.rawcompress) {
                    switch (res.headers["content-encoding"]) {
                        case "deflate":
                            res = res.pipe(zlib.createDeflate());
                            break;
                        case "gzip":
                            res = res.pipe(zlib.createGunzip());
                            break;
                        case "br":
                            res = res.pipe(zlib.createBrotliDecompress());
                            break;
                        default:
                            throw new Error("Content encoding doesn't contains any compression method");
                    }
                }
                this.statuscode = res.statusCode;
                let data = new Response(res);
                res.on("data", (chunk) => {
                    data.add(chunk);
                })
                .once("end", () => {
                    resolve(data);
                })
                .once("error", (err) => {
                    reject(err);
                });
            });
            if (this.data) {
                req.write(this.data);
            }
            if (this.wait) {
                setTimeout(() => {
                    req.destroy();
                }, this.wait);
            } else {
                req.end();
            }
        });
    }
}
