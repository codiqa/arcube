const express = require("express");
const { get, replace, isEmpty } = require("lodash");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

require("dotenv").config(); // Load environment variables

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || "",
  process.env.REACT_APP_SUPABASE_KEY || ""
);

const app = express();

app.use(express.json());

const isUrlValid = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const getShortenUrl = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < 6; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return result;
};

app.post("/shorten", async (req, res) => {
  try {
    const accessToken = replace(
      get(req.headers, "authorization"),
      "Bearer ",
      ""
    );

    const refreshToken = get(req.headers, "refresh-token");

    if (isEmpty(accessToken) || isEmpty(refreshToken))
      return res.status(401).json({ errMessage: "Unauthorized" });

    const orgUrl = get(req.body, "orgUrl");

    if (!isUrlValid(orgUrl)) return res.json({ errMessage: "Invalid URL" });

    const shortUrl = getShortenUrl();

    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const { error } = await supabase
      .from("URLs")
      .insert([{ orgUrl, shortUrl }]);

    if (error) return res.status(500).json({ errMessage: error.message });

    return res.json({ shortUrl });
  } catch (error) {
    return res.status(500).send({ errMessage: "Internal Server Error" });
  }
});

// Serve static files from the React "build" folder
app.use(express.static(path.join(__dirname, "build")));

// Handle React routing, return index.html for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

module.exports = { app, isUrlValid, getShortenUrl };
