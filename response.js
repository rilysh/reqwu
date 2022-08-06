export class Response {
    constructor() {
        this.body = [];
    }
    /**
     * Add chunk to the body array
     * @param chunk - Chunk of data to add to the array
     * @returns None (void) 
     */
    add(chunk) {
        this.body.push(chunk);
    }
    
    /**
     * Convert the whole array to string
     * @returns Converted string of body array
     */
    text() {
        return this.body.toString();
    }

    /**
     * Parse as JSON to the whole body (body must be a valid JSON file) 
     * @returns Parsed JSON output
     */
    json() {
        return JSON.parse(this.body);
    }

    /**
     * Output the raw data of the response
     * @returns Raw result content
     */
    raw() {
        return this.body;
    }
}
