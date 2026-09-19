async function testLive() {
  const url = 'https://knyk-labs.vercel.app';
  console.log(`\n=======================================================`);
  console.log(`PROBING LIVE VERCEL DEPLOYMENT: ${url}`);
  console.log(`=======================================================\n`);

  const routes = [
    '/',
    '/services',
    '/portfolio',
    '/about',
    '/contact',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.webmanifest',
    '/icon',
  ];

  for (const path of routes) {
    try {
      const res = await fetch(`${url}${path}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
      });
      const ct = res.headers.get('content-type') || '';
      console.log(`\n--- [${res.status} ${res.statusText}] ${path} (${ct}) ---`);

      if (path === '/robots.txt' || path === '/sitemap.xml' || path === '/manifest.webmanifest') {
        const text = await res.text();
        console.log(`  Preview (first 300 chars):\n  ${text.slice(0, 300).replace(/\n/g, '\n  ')}`);
        continue;
      }

      if (path === '/icon') {
        console.log(`  Icon Content-Length: ${res.headers.get('content-length')} bytes`);
        continue;
      }

      if (ct.includes('html')) {
        const html = await res.text();
        const titleMatch = html.match(/<title>([^<]+)<\/title>/);
        const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) ||
                          html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
        const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) ||
                               html.match(/<link\s+href="([^"]*)"\s+rel="canonical"/i);
        const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
        const ogUrlMatch = html.match(/<meta\s+property="og:url"\s+content="([^"]*)"/i);
        const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
        const jsonLdScripts = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];

        console.log(`  Title:         ${titleMatch ? titleMatch[1] : 'MISSING'}`);
        console.log(`  Description:   ${descMatch ? descMatch[1] : 'MISSING'}`);
        console.log(`  Canonical:     ${canonicalMatch ? canonicalMatch[1] : 'MISSING'}`);
        console.log(`  og:title:      ${ogTitleMatch ? ogTitleMatch[1] : 'MISSING'}`);
        console.log(`  og:url:        ${ogUrlMatch ? ogUrlMatch[1] : 'MISSING'}`);
        console.log(`  H1 Count:      ${h1Matches.length} -> "${h1Matches.join(' | ')}"`);
        console.log(`  JSON-LD Count: ${jsonLdScripts.length}`);
        
        for (let i = 0; i < jsonLdScripts.length; i++) {
          try {
            const parsed = JSON.parse(jsonLdScripts[i][1]);
            const types = Array.isArray(parsed)
              ? parsed.map(item => item['@type']).join(', ')
              : (parsed['@graph'] ? parsed['@graph'].map(item => item['@type']).join(', ') : parsed['@type']);
            console.log(`    Script #${i + 1} @type: [${types}]`);
          } catch (err) {
            console.log(`    Script #${i + 1} JSON Parse Error: ${err.message}`);
          }
        }
      }
    } catch (e) {
      console.log(`Route ${path} ERROR: ${e.message}`);
    }
  }
}

testLive();
