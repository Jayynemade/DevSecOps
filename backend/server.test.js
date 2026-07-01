const request = require("supertest");
const app = require("./server");

describe("GET /api/message", () => {
    it("returns 200 with the backend message", async () => {
        const response = await request(app).get("/api/message");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Hello from Node Backend",
        });
    });

    it("returns JSON content type", async () => {
        const response = await request(app).get("/api/message");

        expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
});

describe("unknown routes", () => {
    it("returns 404 for unregistered paths", async () => {
        const response = await request(app).get("/api/unknown");

        expect(response.status).toBe(404);
    });
});
