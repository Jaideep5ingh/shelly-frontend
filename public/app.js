const subscribeForm = document.getElementById("subscribe-form");
const subscribeEmail = document.getElementById("subscribe-email");
const subscribeWebsite = document.getElementById("subscribe-website");
const subscribeStatus = document.getElementById("subscribe-status");
const feedbackForm = document.getElementById("feedback-form");
const feedbackEmail = document.getElementById("feedback-email");
const feedbackText = document.getElementById("feedback-text");
const feedbackWebsite = document.getElementById("feedback-website");
const feedbackStatus = document.getElementById("feedback-status");

function setStatus(element, message, type) {
  element.textContent = message;
  element.className = `status${type ? ` ${type}` : ""}`;
}

async function postJson(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

subscribeForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = subscribeEmail.value.trim().toLowerCase();
  const website = subscribeWebsite.value.trim();

  if (!email) {
    setStatus(subscribeStatus, "Enter a valid email address.", "err");
    return;
  }

  setStatus(subscribeStatus, "Submitting…", "");
  try {
    const { response, data } = await postJson("/api/subscribe", { email, website });
    if (!response.ok) {
      setStatus(subscribeStatus, data.message || "Subscription failed.", "err");
      return;
    }
    setStatus(subscribeStatus, data.message || "You are in.", "ok");
    subscribeForm.reset();
  } catch {
    setStatus(subscribeStatus, "Network error. Please try again.", "err");
  }
});

feedbackForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = feedbackEmail.value.trim().toLowerCase();
  const feedback = feedbackText.value.trim();
  const website = feedbackWebsite.value.trim();

  if (!email || feedback.length < 8) {
    setStatus(feedbackStatus, "Add a valid email and a little more detail.", "err");
    return;
  }

  setStatus(feedbackStatus, "Sending…", "");
  try {
    const { response, data } = await postJson("/api/feedback", { email, feedback, website });
    if (!response.ok) {
      setStatus(feedbackStatus, data.message || "Feedback failed.", "err");
      return;
    }
    setStatus(feedbackStatus, data.message || "Thanks for the feedback.", "ok");
    feedbackForm.reset();
  } catch {
    setStatus(feedbackStatus, "Network error. Please try again.", "err");
  }
});
