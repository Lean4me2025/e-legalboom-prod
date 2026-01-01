/*************************************************
 * E-LegalBoom — Intake Logic (FINAL / STABLE)
 * • Intake can NEVER be an entry page
 * • Only runs when proper flow context exists
 * • One-way flow: Intake → Payment
 *************************************************/

/* ===============================
   HARD ENTRY GUARD
   Prevents direct access to intake
================================ */
if (!sessionStorage.getItem("eb_order")) {
  window.location.replace("/");
}

/* ===============================
   SUPABASE CLIENT
================================ */
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2amJqZmx0cXNpdnZ4eGlmbnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzYzNTAsImV4cCI6MjA3MzU1MjM1MH0.F4zzcpCHl9v-Rnj0wgKJ5zBf1HteVyXelMLQDDEN28Q";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* ===============================
   ORDER CONTEXT (READ-ONLY)
================================ */
let tier = null;
let docType = null;

try {
  const stored = JSON.parse(sessionStorage.getItem("eb_order") || "{}");
  tier = stored.tier || null;
  docType = stored.doc_type || null;
} catch (_) {
  // silent by design
}

/* ===============================
   FORM HANDLING
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("intakeForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      tier,
      doc_type: docType,

      first_name: getVal("first_name"),
      last_name: getVal("last_name"),
      email: getVal("email"),

      entity_type: getVal("entity_type"),
      entity_name: getVal("entity_name"),
      governing_state: getVal("governing_state"),

      party_a_name: getVal("party_a_name"),
      party_a_role: getVal("party_a_role"),
      party_b_name: getVal("party_b_name"),
      party_b_role: getVal("party_b_role"),

      notes: getVal("notes"),

      source: "intake",
      submitted_at: new Date().toISOString()
    };

    try {
      const { error } = await supabaseClient
        .from("document_requests")
        .insert(payload);

      if (error) {
        alert("Submission failed. Please try again.");
        return;
      }

      window.location.href =
        "/payment.html?tier=" + encodeURIComponent(tier || "");

    } catch (err) {
      alert("Unexpected error. Please retry.");
    }
  });
});

/* ===============================
   HELPER
================================ */
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() || null : null;
}
