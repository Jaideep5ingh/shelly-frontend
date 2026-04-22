const { forward } = require("../lib/forward");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end(JSON.stringify({ message: "Method not allowed" }));
    return;
  }

  const { email, feedback, website } = req.body || {};
  const body = {
    email,
    feedback,
    website
  };

  const result = await forward("feedback", body);
  res.statusCode = result.statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(result.body));
};
