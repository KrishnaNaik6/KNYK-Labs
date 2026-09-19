async function probe() {
  const routes = [
    '/icon',
    '/apple-icon',
    '/manifest.webmanifest',
    '/robots.txt',
    '/sitemap.xml',
    '/',
    '/services',
    '/services/professional-presentation',
    '/portfolio',
    '/about',
    '/contact'
  ];

  for (const r of routes) {
    try {
      const res = await fetch('http://localhost:3008' + r);
      const ct = res.headers.get('content-type') || '';
      console.log(`${r.padEnd(38)} HTTP ${res.status} [${ct.split(';')[0]}]`);

      if (ct.includes('html')) {
        const text = await res.text();
        const titleMatch = text.match(/<title>([^<]+)<\/title>/);
        const canonicalMatch = text.match(/rel="canonical"[^>]*href="([^"]+)"/);
        const h1Match = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
        const jsonLdCount = (text.match(/type="application\/ld\+json"/g) || []).length;
        const iconMatch = text.includes('rel="icon"');
        const appleIconMatch = text.includes('rel="apple-touch-icon"');

        console.log('   Title:          ', titleMatch ? titleMatch[1].trim() : 'NONE');
        console.log('   Canonical:      ', canonicalMatch ? canonicalMatch[1] : 'NONE');
        console.log('   Primary H1:     ', h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'NONE');
        console.log('   JSON-LD scripts:', jsonLdCount);
        console.log('   Favicon tags:   ', iconMatch ? 'OK' : 'MISSING', '| Apple icon:', appleIconMatch ? 'OK' : 'MISSING');
      }
    } catch (e) {
      console.log(r, 'ERROR:', e.message);
    }
  }
}

probe();
