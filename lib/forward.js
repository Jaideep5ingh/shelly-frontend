const DEFAULT_HEADER = "x-forward-secret";

function getEnv(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

async function forward(channel, payload) {
  const target = getEnv(channel === "subscribe" ? "VPS_SUBSCRIBE_URL" : "VPS_FEEDBACK_URL");
  const secret = getEnv("INTAKE_FORWARD_SECRET");
  const headerName = getEnv("INTAKE_AUTH_HEADER") || DEFAULT_HEADER;

  if (!target) {
    return { statusCode: 503, body: { message: "Forward target is not configured" } };
  }

  if (!secret || secret.length < 20) {
    return { statusCode: 500, body: { message: "Forward secret is not configured" } };
  }

  const response = await fetch(target, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [headerName]: secret
    },
    body: JSON.stringify(payload)
  });

  let body = {};
  try {
    const parsed = await response.json();
    if (parsed && typeof parsed === "object") {
      body = parsed;
    }
  } catch {
    body = {};
  }

  return { statusCode: response.status, body };
}

module.exports = { forward };
