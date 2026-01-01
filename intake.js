/**************************************************
 * E-LegalBoom — Intake Logic (Canonical, Stable)
 * Non-blocking • Deterministic • Safe
 **************************************************/

/* ---------- SUPABASE CLIENT ---------- */
const SUPABASE_URL = "https://vvjbjftqsivwxxifovi.supabase.co";
const SUPABASE_ANON_KEY = 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2amJqZmx0cXNpdnZ4eGlmbnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzYzNTAsImV4cCI6MjA3MzU1MjM1MH0.F4zzcpCHl9v-Rnj0wgKJ5zBf1HteVyXelMLQDDEN28Q";


const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* ---------- ORDER CONTEXT (PASS-THROUGH ONLY) ---------- */
let tier = null;
let docType = null;

try {
  const stored = JSON.parse(sessionStorage.getItem("eb_order")) || {};
  tier = stored.tier || null;
  docType = stored.doc_type || null;
} catch (_) {
  // swallow — intake must NEVER block
}

/* ---------- OPTIONAL DISPLAY (READ-ONLY) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const tierEl = document.getElementById("tierLabel");
  const docEl = document.getElementById("docLabel");

  if (tierEl && tier) tierEl.textContent = tier;
  if (docEl && docType) docEl.textContent = docType;
});

/* ---------- FORM SUBMISSION ---------- */
const form = document.getElementById("intakeForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      tier,
      doc_type: docType,

      first_name: document.getElementById("first_name")?.value?.trim() || null,
      last_name: document.getElementById("last_name")?.value?.trim() || null,
      email: document.getElementById("email")?.value?.trim() || null,

      entity_type:
        document.getElementById("entity_type")?.value || null,
      entity_name:
        document.getElementById("entity_name")?.value?.trim() || null,

      governing_state:
        document.getElementById("governing_state")?.value || null,

      party_a_name:
        document.getElementById("party_a_name")?.value?.trim() || null,
      party_a_role:
        document.getElementById("party_a_role")?.value?.trim() || null,
      party_b_name:
        document.getElementById("party_b_name")?.value?.trim() || null,
      party_b_role:
        document.getElementById("party_b_role")?.value?.trim() || null,

      notes:
        document.getElementById("notes")?.value?.trim() || null,

      source: "intake",
      submitted_at: new Date().toISOString()
    };

    try {
      const { error } = await supabaseClient
        .from("document_requests")
        .insert(payload);

      if (error) {
        console.error("Supabase insert error:", error);
        return;
      }

      // SAFE HANDOFF — tier locked if present
      const nextTier = tier ? encodeURIComponent(tier) : "";
      window.location.href = `/payment.html?tier=${nextTier}`;

    } catch (err) {
      console.error("Unexpected intake failure:", err);
    }
  });
}
