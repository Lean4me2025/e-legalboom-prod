// ===== INTAKE PAGE LOGIC =====

// Guard: tier must be locked
if (sessionStorage.getItem("tier_locked") !== "true") {
  window.location.href = "catalog.html";
}

// Load locked values
const orderId = sessionStorage.getItem("order_id");
const tier = sessionStorage.getItem("tier");
const price = sessionStorage.getItem("price");

document.getElementById("lockedInfo").innerHTML = `
  <strong>Selected Tier:</strong> ${tier} (locked)<br />
  <strong>Order ID:</strong> ${orderId}
`;

// Supabase init
const supabase = supabase.createClient(
  "https://vvjbjfltqsivvxxifnvi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2amJqZmx0cXNpdnZ4eGlmbnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzYzNTAsImV4cCI6MjA3MzU1MjM1MH0.F4zzcpCHl9v-Rnj0wgKJ5zBf1HteVyXelMLQDDEN28Q"
);

// Submit intake
document.getElementById("intakeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("first_name").value;
  const lastName = document.getElementById("last_name").value;
  const email = document.getElementById("email").value;

  const { error } = await supabase
    .from("pweb_orders")
    .insert([{
      order_id: orderId,
      client_first_name: firstName,
      client_last_name: lastName,
      client_email: email,
      tier,
      price,
      order_status: "submitted"
    }]);

  if (error) {
    alert("Error submitting order. Please try again.");
    return;
  }

  window.location.href = "payment.html";
});

// ===== ABORT LOGIC =====
function abortOrder() {
  const confirmAbort = confirm(
    "If you cancel, your information will not be saved and you will need to start over."
  );
