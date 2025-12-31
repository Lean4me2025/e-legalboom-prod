document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     SUPABASE CLIENT (BROWSER SAFE)
     =============================== */
  const SUPABASE_URL = "https://vvjbjfltqsivvxxifnvi.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2amJqZmx0cXNpdnZ4eGlmbnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzYzNTAsImV4cCI6MjA3MzU1MjM1MH0.F4zzcpCHl9v-Rnj0wgKJ5zBf1HteVyXelMLQDDEN28Q";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  /* ===============================
     POPULATE STATES
     =============================== */
  const states = [
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
    "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
    "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
  ];

  ["state", "governing_state"].forEach(id => {
    const select = document.getElementById(id);
    states.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      select.appendChild(opt);
    });
  });

  /* ===============================
     URL CONTEXT (FROM SUMMARY)
     =============================== */
  const params = new URLSearchParams(window.location.search);
  if (params.get("tier")) {
    document.getElementById("tier").value = params.get("tier");
  }
  if (params.get("doc_type")) {
    document.getElementById("doc_type").value = params.get("doc_type");
  }

  /* ===============================
     SUBMIT HANDLER
     =============================== */
  const form = document.getElementById("intakeForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(form));

    const { error } = await supabaseClient
      .from("document_requests")
      .insert([formData], { returning: "minimal" });

    if (error) {
      console.error("Supabase error:", error);
      alert("We could not save your information. Please try again.");
      return;
    }

    // SUCCESS → PAYMENT
    window.location.href =
      `/payment.html?tier=${formData.tier}&doc_type=${formData.doc_type}`;
  });

});
