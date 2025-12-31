import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ================================
   SUPABASE CONFIG  ✅ PUT IT HERE
   ================================ */
const SUPABASE_URL = "https://vvjbjfltqsivvxxifnvi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2amJqZmx0cXNpdnZ4eGlmbnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzYzNTAsImV4cCI6MjA3MzU1MjM1MH0.F4zzcpCHl9v-Rnj0wgKJ5zBf1HteVyXelMLQDDEN28Q";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* ================================
   CONTEXT FROM URL
   ================================ */
const params = new URLSearchParams(window.location.search);
["tier", "doc_type", "urgency"].forEach(k => {
  const el = document.getElementById(k);
  if (el && params.get(k)) el.value = params.get(k);
});

/* ================================
   STATE DROPDOWNS
   ================================ */
const states = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
  "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
  "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

document
  .querySelectorAll("select[name='state'], select[name='governing_state']")
  .forEach(select => {
    states.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      select.appendChild(opt);
    });
  });

/* ================================
   FORM SUBMIT → SUPABASE
   ================================ */
document
  .getElementById("intakeForm")
  .addEventListener("submit", async e => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target));

    const { error } = await supabase
      .from("requests")
      .insert([formData]);

    if (error) {
      console.error(error);
      alert("Submission failed. Please try again.");
      return;
    }

    // proceed to payment
    window.location.href =
      `/payment.html?tier=${formData.tier}&doc_type=${formData.doc_type}`;
  });
