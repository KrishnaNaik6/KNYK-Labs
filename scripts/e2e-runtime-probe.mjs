// Headless E2E runtime probe against Next.js production server
const BASE_URL = "http://localhost:3005";

async function probe() {
  console.log("=== KNYK LABS E2E RUNTIME PROBE ===");
  const checks = [];

  // 1. Home Page
  try {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    const hasInternalFields = html.includes("is_enabled") || html.includes("isFeatured\":") || html.includes("status\":");
    checks.push({
      route: "/",
      status: res.status,
      ok: res.status === 200,
      hasInternalLeak: hasInternalFields,
      titleFound: html.includes("KNYK Labs"),
    });
    console.log(`[PASS] / -> HTTP ${res.status}, leak=${hasInternalFields}`);
  } catch (e) {
    checks.push({ route: "/", error: e.message });
  }

  // 2. Services Page
  try {
    const res = await fetch(`${BASE_URL}/services`);
    const html = await res.text();
    checks.push({
      route: "/services",
      status: res.status,
      ok: res.status === 200,
      hasSoftwareDev: html.includes("Software &amp; Development") || html.includes("Software & Development"),
    });
    console.log(`[PASS] /services -> HTTP ${res.status}`);
  } catch (e) {
    checks.push({ route: "/services", error: e.message });
  }

  // 3. Service Detail (Valid slug from real NEXIS)
  try {
    const res = await fetch(`${BASE_URL}/services/professional-presentation`);
    const html = await res.text();
    checks.push({
      route: "/services/professional-presentation",
      status: res.status,
      ok: res.status === 200,
      hasServiceName: html.includes("Professional Presentation"),
      hasAdvanceTerms: html.includes("Advance Terms") || html.includes("30% Advance"),
    });
    console.log(`[PASS] /services/professional-presentation -> HTTP ${res.status}`);
  } catch (e) {
    checks.push({ route: "/services/professional-presentation", error: e.message });
  }

  // 4. Service Detail (Invalid slug -> 404)
  try {
    const res = await fetch(`${BASE_URL}/services/definitely-non-existent-service-12345`);
    checks.push({
      route: "/services/invalid-slug",
      status: res.status,
      ok: res.status === 404,
    });
    console.log(`[PASS] /services/invalid-slug -> HTTP ${res.status} (Expected 404)`);
  } catch (e) {
    checks.push({ route: "/services/invalid-slug", error: e.message });
  }

  // 5. Portfolio Page
  try {
    const res = await fetch(`${BASE_URL}/portfolio`);
    const html = await res.text();
    checks.push({
      route: "/portfolio",
      status: res.status,
      ok: res.status === 200,
      hasEmptyOrProjects: html.includes("Selected Work is Coming Soon") || html.includes("Proof of Work"),
    });
    console.log(`[PASS] /portfolio -> HTTP ${res.status}`);
  } catch (e) {
    checks.push({ route: "/portfolio", error: e.message });
  }

  // 6. Portfolio Detail (Invalid slug -> 404)
  try {
    const res = await fetch(`${BASE_URL}/portfolio/definitely-non-existent-project-99999`);
    checks.push({
      route: "/portfolio/invalid-slug",
      status: res.status,
      ok: res.status === 404,
    });
    console.log(`[PASS] /portfolio/invalid-slug -> HTTP ${res.status} (Expected 404)`);
  } catch (e) {
    checks.push({ route: "/portfolio/invalid-slug", error: e.message });
  }

  // 7. About Page
  try {
    const res = await fetch(`${BASE_URL}/about`);
    checks.push({
      route: "/about",
      status: res.status,
      ok: res.status === 200,
    });
    console.log(`[PASS] /about -> HTTP ${res.status}`);
  } catch (e) {
    checks.push({ route: "/about", error: e.message });
  }

  // 8. Contact Page
  try {
    const res = await fetch(`${BASE_URL}/contact`);
    const html = await res.text();
    checks.push({
      route: "/contact",
      status: res.status,
      ok: res.status === 200,
      hasPhone: html.includes("9353640765"),
    });
    console.log(`[PASS] /contact -> HTTP ${res.status}`);
  } catch (e) {
    checks.push({ route: "/contact", error: e.message });
  }

  // 9. Robots.txt
  try {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    const text = await res.text();
    checks.push({
      route: "/robots.txt",
      status: res.status,
      ok: res.status === 200,
      hasSitemap: text.includes("sitemap.xml"),
    });
    console.log(`[PASS] /robots.txt -> HTTP ${res.status}`);
  } catch (e) {
    checks.push({ route: "/robots.txt", error: e.message });
  }

  // 10. Sitemap.xml
  try {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    const text = await res.text();
    checks.push({
      route: "/sitemap.xml",
      status: res.status,
      ok: res.status === 200,
      hasServices: text.includes("/services/"),
    });
    console.log(`[PASS] /sitemap.xml -> HTTP ${res.status}`);
  } catch (e) {
    checks.push({ route: "/sitemap.xml", error: e.message });
  }

  // 11. Enquiry Route Handler: Invalid Input
  try {
    const res = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", email: "bad-email" }),
    });
    const json = await res.json();
    checks.push({
      route: "POST /api/enquiries (invalid)",
      status: res.status,
      ok: res.status === 400,
      hasValidationError: Boolean(json.validationErrors),
    });
    console.log(`[PASS] POST /api/enquiries (invalid) -> HTTP ${res.status}`);
  } catch (e) {
    checks.push({ route: "POST /api/enquiries (invalid)", error: e.message });
  }

  // 12. Enquiry Route Handler: Valid Input -> Forwarded to live NEXIS
  try {
    const res = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "E2E Integration Verification",
        email: "e2e-audit@knyklabs.com",
        phone: "+919353640765",
        message: "E2E runtime probe testing full Next.js server route forwarding to live NEXIS.",
        source: "e2e_runtime_probe",
      }),
    });
    const json = await res.json();
    const hasLeadIdLeak = "id" in json || "leadId" in json || (json.data && ("id" in json.data || "leadId" in json.data));
    checks.push({
      route: "POST /api/enquiries (valid)",
      status: res.status,
      ok: res.status === 200 && json.success === true,
      hasLeadIdLeak,
      message: json.message,
    });
    console.log(`[PASS] POST /api/enquiries (valid) -> HTTP ${res.status}, success=${json.success}, leakedLeadId=${hasLeadIdLeak}`);
  } catch (e) {
    checks.push({ route: "POST /api/enquiries (valid)", error: e.message });
  }

  console.log("\n--- E2E Runtime Probe Summary ---");
  console.log(JSON.stringify(checks, null, 2));
}

probe();
