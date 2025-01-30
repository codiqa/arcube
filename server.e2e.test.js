const request = require("supertest");
const app = require("./server"); // Import the Express app

const { createClient } = require("@supabase/supabase-js");

jest.mock("@supabase/supabase-js");
const mockSupabase = {
  auth: {
    setSession: jest.fn().mockResolvedValue({ error: null }),
  },
  from: jest.fn(() => ({
    insert: jest.fn().mockResolvedValue({ error: null }), // Mock DB insert
  })),
};
createClient.mockReturnValue(mockSupabase);

describe("🚀 API End-to-End Tests", () => {
  let server;

  beforeAll((done) => {
    server = app.listen(4000, done); // Start server on a test port
  });

  afterAll((done) => {
    server.close(done); // Close server after tests
  });

  test("🔑 Should return 401 when no auth tokens are provided", async () => {
    const response = await request(server).post("/shorten").send({
      orgUrl: "https://example.com",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("errMessage", "Unauthorized");
  });

  test("🛑 Should return 400 for invalid URL", async () => {
    const response = await request(server)
      .post("/shorten")
      .set("Authorization", "Bearer valid_token")
      .set("refresh-token", "valid_refresh")
      .send({ orgUrl: "invalid-url" });

    expect(response.status).toBe(200); // Ensure API runs
    expect(response.body).toHaveProperty("errMessage", "Invalid URL");
  });
});
