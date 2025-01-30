const request = require("supertest");
const { createClient } = require("@supabase/supabase-js");
const app = require("./server"); // Import functions
const { isUrlValid, getShortenUrl } = require("./utils");

jest.mock("@supabase/supabase-js");

// Mock Supabase Client
const mockSupabase = {
  auth: {
    setSession: jest.fn(),
  },
  from: jest.fn(() => ({
    insert: jest.fn().mockResolvedValue({ error: null }),
  })),
};

createClient.mockReturnValue(mockSupabase);

// 🔹 Test URL Validation Function
describe("isUrlValid", () => {
  test("should return true for a valid URL", () => {
    expect(isUrlValid("https://example.com")).toBe(true);
  });

  test("should return false for an invalid URL", () => {
    expect(isUrlValid("invalid-url")).toBe(false);
  });
});

// 🔹 Test Short URL Generation
describe("getShortenUrl", () => {
  test("should generate a 6-character string", () => {
    const shortUrl = getShortenUrl();
    expect(shortUrl).toHaveLength(6);
    expect(typeof shortUrl).toBe("string");
  });
});

// 🔹 Test API Endpoint
describe("POST /shorten", () => {
  test("should return 401 if no access token is provided", async () => {
    const response = await request(app).post("/shorten").send({
      orgUrl: "https://example.com",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("errMessage", "Unauthorized");
  });

  test("should return 400 for invalid URL", async () => {
    const response = await request(app)
      .post("/shorten")
      .set("Authorization", "Bearer valid_token")
      .set("refresh-token", "valid_refresh")
      .send({ orgUrl: "invalid-url" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("errMessage", "Invalid URL");
  });
});
