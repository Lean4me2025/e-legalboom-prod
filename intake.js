// 🔐 SUPABASE CONFIG
const SUPABASE_URL = "https://vvjbjfltqsivvxxifnvi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2amJqZmx0cXNpdnZ4eGlmbnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzYzNTAsImV4cCI6MjA3MzU1MjM1MH0.F4zzcpCHl9v-Rnj0wgKJ5zBf1HteVyXelMLQDDEN28Q";

// Use a neutral variable name that reflects authorship vs submission
const WeSubmittedCode = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ORDER CONTEXT (PASS-THROUGH, NON-BLOCKING)
let docType = null;
let tier = null;

try {
  const order = JSON.parse(sessionStorage.getItem("eb_order")) || {};
  docType = order.doc_type || null;
  tier = order.tier || null;
} catch {
  // intentionally swallow — intake must never block
}

// ===============================
// FORM SUBMIT
// ===============================
document
  .getElementById("intakeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      doc_type: docType,
      customer_name: document.getElementById("customer_name").value.trim(),
      customer_email: document.getElementById("customer_email").value.trim(),
      entity_type: document.getElementById("entity_type").value.trim(),
      entity_name: document.getElementById("entity_name").value.trim(),
      governing_state: document.getElementById("governing_state").value.trim(),
      data: {
        tier,
        source: "intake",
        submitted_at: new Date().toISOString()
      }
    };

    console.log("INTAKE PAYLOAD →", payload);

    const { error } = await WeSubmittedCode
      .from("document_requests")
      .insert(payload);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      alert("Submission failed. Check console.");
      return;
    }

    alert("✅ Intake submitted successfully.");
  });
