/*************************************************
 * E-LegalBoom — Intake Logic (Stable)
 * Scope-Safe • Non-Blocking • Deterministic
 *************************************************/

// 🔒 HARD STOP — do nothing unless intake form exists
const intakeForm = document.getElementById("intakeForm");
if (!intakeForm) {
  console.warn("intake.js loaded on non-intake page — exiting safely");
  return;
}

/* ===============================
   SUPABASE CLIENT
================================ */
const SUPABASE_URL = "https://vvjbfjtqsivxxifovi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2amJqZmx0cXNpdnZ4eGlmbnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzYzNTAsImV4cCI6MjA3MzU1MjM1MH0.F4zzcpCHl9v-Rnj0wgKJ5zBf1HteVyXelMLQDDEN28Q";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* ===============================
   CONTEXT (READ-ONLY)
================================ */
let tier = null;
let docType = null;

try {
  const stored = JSON.parse(sessionStorage.getItem("eb_order")) || {};
  tier = stored.tier || null;
  docType = stored.doc_type || null;
} catch (_) {
  // intentionally swallow — intake must never block
}

/* ===============================
   DISPLAY CONTEXT (OPTIONAL)
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const tierEl = document.getElementById("tierLabel");
  const docEl = document.getElementById("docLabel");

  if (tierEl) tierEl.textContent = tier || "—";
  if (docEl) docEl.textContent = docType || "—";
});

/* ===============================
   FORM SUBMISSION
================================ */
intakeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    tier,
    doc_type: docType,

    first_name: document.getElementById("first_name").value.trim(),
    last_name: document.getElementById("last_name").value.trim(),
    email: document.getElementById("email").value.trim(),

    entity_type: document.getElementById("entity_type")?.value || null,
    entity_name: document.getElementById("entity_name")?.value || null,
    governing_state: document.getElementById("governing_state")?.value || null,

    source: "intake",
    submitted_at: new Date().toISOString()
  };

  try {
    const { error } = await supabaseClient
      .from("document_requests")
      .insert(payload);

    if (error) {
      console.error("Supabase insert failed:", error);
      alert("Submission failed. Please try again.");
      return;
    }

    // ✅ HANDOFF TO PAYMENT — ONLY PLACE REDIRECT OCCURS
    window.location.href = `/payment.html?tier=${encodeURIComponent(tier || "")}`;

  } catch (err) {
    console.error("Unexpected intake failure:", err);
    alert("Unexpected error. Please retry.");
  }
});
