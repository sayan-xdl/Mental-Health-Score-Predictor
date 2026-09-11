// =================================================================
// CONFIG — change this one line if your FastAPI server runs
// somewhere other than the default local address.
// =================================================================
const API_BASE_URL = "http://127.0.0.1:8000";

// -----------------------------------------------------------------
// Element references
// -----------------------------------------------------------------
const form = document.getElementById("predictForm");
const predictBtn = document.getElementById("predictBtn");
const btnLabel = document.getElementById("btnLabel");
const btnSpinner = document.getElementById("btnSpinner");
const formError = document.getElementById("formError");

const outputEmpty = document.getElementById("outputEmpty");
const resultCard = document.getElementById("resultCard");
const resultValue = document.getElementById("resultValue");
const tierBadge = document.getElementById("tierBadge");
const gaugeProgress = document.getElementById("gaugeProgress");
const errorCard = document.getElementById("errorCard");
const errorMessage = document.getElementById("errorMessage");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

// -----------------------------------------------------------------
// Check the backend is reachable (calls the existing GET "/" route)
// -----------------------------------------------------------------
async function checkApiStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/`);
    if (!res.ok) throw new Error("Bad response");
    statusDot.classList.add("online");
    statusText.textContent = "Model ready";
  } catch (err) {
    statusDot.classList.add("offline");
    statusText.textContent = "Model unreachable";
  }
}

checkApiStatus();

// -----------------------------------------------------------------
// Build the JSON payload from the form.
// Field names below match the FastAPI StudentData model EXACTLY —
// do not rename these keys, the backend expects them as-is.
// -----------------------------------------------------------------
function buildPayload() {
  const data = new FormData(form);

  return {
    age: parseInt(data.get("age"), 10),
    gender: data.get("gender"),
    country: data.get("country").trim(),
    academic_level: data.get("academic_level"),
    most_used_platform: data.get("most_used_platform"),
    purpose_of_use: data.get("purpose_of_use"),
    avg_daily_usage_hours: parseFloat(data.get("avg_daily_usage_hours")),
    daily_unlocks: parseInt(data.get("daily_unlocks"), 10),
    study_hours: parseFloat(data.get("study_hours")),
    physical_activity_hours: parseFloat(data.get("physical_activity_hours")),
    sleep_hours_per_night: parseFloat(data.get("sleep_hours_per_night")),
    stress_level: data.get("stress_level"),
  };
}

// -----------------------------------------------------------------
// UI state helpers
// -----------------------------------------------------------------
function setLoading(isLoading) {
  predictBtn.disabled = isLoading;
  btnSpinner.hidden = !isLoading;
  btnLabel.textContent = isLoading ? "Generating…" : "Generate score";
}

// Display-only bands for the gauge, assuming a 0-10 scale (see the
// caveat about this range in the chat — adjust SCALE_MAX if your
// model's target range is different).
const SCALE_MAX = 10;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 58; // matches the SVG circle r=58
const TIERS = [
  { max: 3.33, label: "Low", color: "#FF6B6B" },
  { max: 6.66, label: "Moderate", color: "#FF9052" },
  { max: Infinity, label: "Good", color: "#34D399" },
];

function getTier(score) {
  return TIERS.find((t) => score <= t.max) || TIERS[TIERS.length - 1];
}

gaugeProgress.style.strokeDasharray = `${GAUGE_CIRCUMFERENCE}`;

function showResult(score) {
  outputEmpty.hidden = true;
  errorCard.hidden = true;
  resultValue.textContent = score;

  const numeric = Number(score);
  const clamped = Math.max(0, Math.min(SCALE_MAX, numeric));
  const tier = getTier(clamped);
  const fraction = clamped / SCALE_MAX;

  resultValue.style.color = tier.color;
  tierBadge.textContent = tier.label;
  tierBadge.style.background = tier.color;

  gaugeProgress.style.stroke = tier.color;
  gaugeProgress.style.strokeDashoffset = `${GAUGE_CIRCUMFERENCE * (1 - fraction)}`;

  resultCard.hidden = false;
}

function showError(message) {
  outputEmpty.hidden = true;
  resultCard.hidden = true;
  errorMessage.textContent = message;
  errorCard.hidden = false;
}

// -----------------------------------------------------------------
// Submit handler
// -----------------------------------------------------------------
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.hidden = true;

  // Native HTML5 validation (required fields, min/max, step) first.
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const payload = buildPayload();

  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // FastAPI validation errors come back as { detail: [...] } or { detail: "..." }
      let detail = `Server responded with status ${response.status}.`;
      try {
        const errBody = await response.json();
        if (typeof errBody.detail === "string") {
          detail = errBody.detail;
        } else if (Array.isArray(errBody.detail)) {
          detail = errBody.detail.map((d) => d.msg).join("; ");
        }
      } catch (_) {
        // response had no JSON body — keep the generic message
      }
      throw new Error(detail);
    }

    const result = await response.json();
    showResult(result.predicted_mental_health_score);
  } catch (err) {
    const message =
      err instanceof TypeError
        ? "Could not reach the backend. Is the FastAPI server running at " + API_BASE_URL + "?"
        : err.message;
    showError(message);
  } finally {
    setLoading(false);
  }
});
