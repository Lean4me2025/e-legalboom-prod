// 🔐 SUPABASE CONFIG
const SUPABASE_URL = "https://vvjbjfltqsivvxxifnvi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2amJqZmx0cXNpdnZ4eGlmbnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzYzNTAsImV4cCI6MjA3MzU1MjM1MH0.F4zzcpCHl9v-Rnj0wgKJ5zBf1HteVyXelMLQDDEN28Q";

const supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// 📤 FORM HANDLER
document.getElementById("intakeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    customer_name: document.getElementById("customer_name").value.trim(),
    customer_email: document.getElementById("customer_email").value.trim(),
    doc_type: document.getElementById("doc_type").value.trim(),
    entity_type: document.getElementById("entity_type").value.trim(),
    entity_name: document.getElementById("entity_name").value.trim(),
    governing_state: document.getElementById("governing_state").value.trim(),
    data: {
      submitted_from: "intake_phase_1",
      timestamp: new Date().toISOString()
    }
  };

  console.log("INSERT PAYLOAD →", payload);

  const { data, error } = await supabase
    .from("document_requests")
    .insert(payload);

  if (error) {
    console.error("SUPABASE INSERT ERROR:", error);
    alert("Error submitting intake. Check console.");
    return;
  }

  alert("✅ Intake submitted successfully.");
  console.log("INSERT SUCCESS:", data);
});
