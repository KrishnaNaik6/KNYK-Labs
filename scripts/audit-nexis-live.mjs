// Probe script to audit all live frozen endpoints on NEXIS
const BASE_URL = process.env.NEXIS_API_URL || "https://nexis-02is.onrender.com";

console.log(`Auditing NEXIS live endpoint at: ${BASE_URL}`);

const endpoints = [
  { path: "/api/v1/knyk/services", method: "GET" },
  { path: "/api/v1/knyk/contact", method: "GET" },
  { path: "/api/v1/knyk/business", method: "GET" },
  { path: "/api/v1/knyk/branding", method: "GET" },
  { path: "/api/v1/knyk/portfolio", method: "GET" },
  { path: "/api/v1/knyk/testimonials", method: "GET" },
  { path: "/api/v1/knyk/website", method: "GET" },
];

async function runAudit() {
  const results = {};

  for (const ep of endpoints) {
    const url = `${BASE_URL.replace(/\/+$/, "")}${ep.path}`;
    const start = performance.now();
    try {
      const res = await fetch(url, {
        method: ep.method,
        headers: { Accept: "application/json" },
      });
      const latencyMs = Math.round(performance.now() - start);
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        // Not JSON
      }

      results[ep.path] = {
        status: res.status,
        ok: res.ok,
        latencyMs,
        success: data?.success,
        dataKeys: data?.data ? Object.keys(data.data) : (Array.isArray(data?.data) ? `Array(${data.data.length})` : typeof data?.data),
        sample: data?.data,
        headers: {
          cacheControl: res.headers.get("cache-control"),
          contentType: res.headers.get("content-type"),
        }
      };
      console.log(`[PASS] ${ep.path} -> HTTP ${res.status} (${latencyMs}ms) success=${data?.success}`);
    } catch (err) {
      const latencyMs = Math.round(performance.now() - start);
      results[ep.path] = {
        error: err.message,
        latencyMs,
      };
      console.error(`[FAIL] ${ep.path} -> Error: ${err.message}`);
    }
  }

  // Probe POST enquiry
  console.log("\nProbing POST /api/v1/knyk/enquiries (Live validation probe)...");
  const enquiryUrl = `${BASE_URL.replace(/\/+$/, "")}/api/v1/knyk/enquiries`;
  
  // 1. Invalid payload probe
  try {
    const invalidRes = await fetch(enquiryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: "", email: "not-valid" }),
    });
    const invalidJson = await invalidRes.json();
    console.log(`[PROBE 1 - Invalid Input] HTTP ${invalidRes.status}:`, JSON.stringify(invalidJson));
  } catch (err) {
    console.error(`[PROBE 1 - Error]`, err.message);
  }

  // 2. Valid test enquiry probe
  try {
    const validPayload = {
      name: "E2E Audit Test Bot",
      email: "audit-test@knyklabs.com",
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      budget: "₹50,000 - ₹1,00,000",
      message: "Automated verification test of enquiry submission gateway.",
      source: "e2e_integration_audit",
    };
    const validRes = await fetch(enquiryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(validPayload),
    });
    const validJson = await validRes.json();
    console.log(`[PROBE 2 - Valid Submission] HTTP ${validRes.status}:`, JSON.stringify(validJson));
  } catch (err) {
    console.error(`[PROBE 2 - Error]`, err.message);
  }

  console.log("\n--- Full Audit Report Preview ---");
  console.log(JSON.stringify(results, null, 2));
}

runAudit();
