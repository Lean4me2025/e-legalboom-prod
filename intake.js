/***************************************
 * E-LegalBoom — Intake Logic
 * Canonical, Non-Blocking
 ***************************************/

// ---- SUPABASE CLIENT INIT ----
// If you already load this globally elsewhere, keep this.
// Otherwise, this is required.
const SUPABASE_URL = "https://vvjbjfltqsivvxxifnvi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2amJqZmx0cXNpdnZ4eGlmbnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzYzNTAsImV4cCI6MjA3MzU1MjM1MH0.F4zzcpCHl9v-Rnj0wgKJ5zBf1HteVyXelMLQDDEN28Q";


const webSubmittedCode = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ---- RECEIVE CONTEXT (PASS-THROUGH ONLY) ----
let tier = null;
let docType = null;

try {
  const order = JSON.parse(sessionStorage.getItem("eb_order")) || {};
  tier = order.tier || null;
  docType = order.doc_type || null;
} catch {
  // swallow — intake must never block
}

// ---- FRIENDLY LABEL MAPS ----
const tierMap = {
  T1: "Tier 1",
  T2: "Tier 2",
  T3: "Tier 3",
  BUNDLE: "Bundle"
};

const docMap = {
  llc_single_member: "Single-Member LLC",
  llc_multi_member: "Multi-Member LLC",
  promissory_note: "Promissory Note",
  independent_contractor: "Independent Contractor Agreement"
};

// ---- DISPLAY CONTEXT (READ-ONLY) ----
document.addEventListener("DOMContentLoaded", () => {
  const tierEl = document.getElementById("tierLabel");
  const docEl = document.getElementById("docLabel");

  if (tierEl) tierEl.textContent = tierMap[tier] || tier || "—";
  if (docEl) docEl.textContent = docMap[docType] || docType || "—";
});

// ---- FORM SUBMISSION ----
document.getElementById("intakeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    tier,
    doc_type: docType,

    first_name: document.getElementById("first_name").value.trim(),
    last_name: document.getElementById("last_name").value.trim(),
    email: document.getElementById("email").value.trim(),

    entity_type: document.getElementById("entity_type").value || null,
    entity_name: document.getElementById("entity_name").value || null,

    governing_state: document.getElementById("governing_state").value,

    party_a_name: document.getElementById("party_a_name").value || null,
    party_a_role: document.getElementById("party_a_role").value || null,
    party_b_name: document.getElementById("party_b_name").value || null,
    party_b_role: document.getElementById("party_b_role").value || null,

    notes: document.getElementById("notes").value || null,
    source: "intake",
    submitted_at: new Date().toISOString()
  };

  try {
    const { error } = await webSubmittedCode
      .from("document_requests")
      .insert(payload);

    if (error) {
      console.error("Supabase insert error:", error);
    }
  } catch (err) {
    console.error("Unexpected insert failure:", err);
  }

  // ---- HANDOFF TO PAYMENT (TIER LOCKED) ----
  window.location.href = `/payment.html?tier=${encodeURIComponent(tier || "")}`;
});
