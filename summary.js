// --- Read parameters from Tier page ---
const params = new URLSearchParams(window.location.search);
const tier = params.get("tier");
const docType = params.get("doc_type");

// --- Guard: Summary MUST have tier + doc_type ---
if (!tier || !docType) {
  window.location.href = "catalog.html";
}

// --- Create authoritative Order Intent ---
const orderIntent = {
  order_id: "ELB-" + Date.now(),
  tier: tier,
  doc_type: docType,
  status: "intent",
  created_at: new Date().toISOString()
};

// --- Persist as authoritative state ---
sessionStorage.setItem("elb_order_intent", JSON.stringify(orderIntent));

// --- Render summary ---
document.getElementById("summary").innerHTML = `
  <div class="summary-line"><strong>Order ID:</strong> ${orderIntent.order_id}</div>
  <div class="summary-line"><strong>Tier:</strong> ${orderIntent.tier}</div>
  <div class="summary-line"><strong>Document:</strong> ${orderIntent.doc_type}</div>
`;

// --- Navigation controls ---
function continueToIntake() {
  window.location.href = "intake.html";
}

function abortOrder() {
  sessionStorage.removeItem("elb_order_intent");
  window.location.href = "catalog.html";
}
