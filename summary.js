// ===== SUMMARY PAGE LOGIC =====

// Example: values coming from Catalog selection
// (These would already be set before landing here)
const category = sessionStorage.getItem("category");
const tier = sessionStorage.getItem("tier");
const price = sessionStorage.getItem("price");
const docType = sessionStorage.getItem("doc_type");

// Guard: must come from catalog
if (!category || !tier || !price) {
  window.location.href = "catalog.html";
}

// Generate Order ID
const orderId = `ELB-${Date.now()}`;
sessionStorage.setItem("order_id", orderId);

// Lock tier
sessionStorage.setItem("tier_locked", "true");

// Display summary
document.getElementById("summaryDetails").innerHTML = `
  <p><strong>Category:</strong> ${category}</p>
  <p><strong>Document:</strong> ${docType || "Selected Document"}</p>
  <p><strong>Tier:</strong> ${tier}</p>
  <p><strong>Price:</strong> $${price}</p>
  <p><strong>Order ID:</strong> ${orderId}</p>
`;

// Continue
function continueToIntake() {
  window.location.href = "intake.html";
}

// ===== ABORT LOGIC =====
function abortOrder() {
  const confirmAbort = confirm(
    "If you cancel, your information will not be saved and you will need to start over."
  );

  if (!confirmAbort) return;

  sessionStorage.clear();
  window.location.href = "catalog.html";
}
