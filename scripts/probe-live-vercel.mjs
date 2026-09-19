async function testLive() {
  const url = 'https://knyk-labs.vercel.app';
  console.log(`\nProbing Live Vercel Deployment: ${url}\n${'='.repeat(50)}`);

  const routes = ['/', '/services', '/about', '/contact', '/robots.txt', '/sitemap.xml'];

  for (const path of routes) {
    try {
      const res = await fetch(`${url}${path}`);
      console.log(`\nRoute: ${path} -> Status: ${res.status} ${res.statusText}`);
      const ct = res.headers.get('content-type') || '';
      console.log(`  Content-Type: ${ct}`);
      console.log(`  Security Headers:`);
      console.log(`    Strict-Transport-Security: ${res.headers.get('strict-transport-security')}`);
      console.log(`    X-Content-Type-Options: ${res.headers.get('x-content-type-options')}`);
      console.log(`    X-Frame-Options: ${res.headers.get('x-frame-options')}`);

      if (ct.includes('html')) {
        const html = await res.text();
        const title = html.match(/<title>([^<]+)<\/title>/);
        const desc = html.match(/<meta name="description" content="([^"]+)"/);
        const canonical = html.match(/rel="canonical"[^>]*href="([^"]+)"/);
        const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
        const icon = html.match(/rel="icon"[^>]*href="([^"]+)"/);

        console.log(`  Title:       ${title ? title[1] : 'NONE'}`);
        console.log(`  Description: ${desc ? desc[1] : 'NONE'}`);
        console.log(`  Canonical:   ${canonical ? canonical[1] : 'NONE'}`);
        console.log(`  H1:        ${h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : 'NONE'}`);
        console.log(`  Favicon:   ${icon ? icon[1] : 'NONE'}`);
      }
    } catch (e) {
      console.log(`Route ${path} ERROR: ${e.message}`);
    }
  }
}

testLive();
