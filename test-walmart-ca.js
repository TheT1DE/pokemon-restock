const axios = require('axios');

const URL = 'https://www.walmart.ca/en/search?q=pokemon%20trading%20card%20game';

async function main() {
  console.log('[Test] Fetching Walmart Canada...');
  console.log(URL);

  try {
    const response = await axios.get(URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/124.0.0.0 Safari/537.36',

        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,' +
          'image/avif,image/webp,*/*;q=0.8',

        'Accept-Language': 'en-CA,en;q=0.9',

        'Cache-Control': 'no-cache',
      },

      timeout: 30000,
      maxRedirects: 5,
      decompress: true,
    });

    console.log('\n[Test] HTTP status:', response.status);
    console.log('[Test] Final URL:', response.request?.res?.responseUrl);
    console.log('[Test] HTML length:', response.data.length);

    const html = response.data;

    console.log(
      '[Test] Contains __NEXT_DATA__:',
      html.includes('__NEXT_DATA__')
    );

    console.log(
      '[Test] Contains "Pokemon":',
      /pokemon/i.test(html)
    );

    console.log(
      '[Test] Contains "Robot or human":',
      /Robot or human/i.test(html)
    );

    console.log(
      '[Test] Contains Cloudflare:',
      /cloudflare/i.test(html)
    );

    // Save a small diagnostic portion of the HTML.
    console.log('\n[Test] First 1,000 characters:\n');
    console.log(html.slice(0, 1000));

    // Try to locate __NEXT_DATA__
    const match = html.match(
      /<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i
    );

    if (match) {
      console.log('\n[Test] __NEXT_DATA__ found.');

      try {
        const data = JSON.parse(match[1]);

        console.log(
          '[Test] Top-level keys:',
          Object.keys(data)
        );

        console.log(
          '[Test] props keys:',
          Object.keys(data.props || {})
        );

        console.log(
          '[Test] pageProps keys:',
          Object.keys(data.props?.pageProps || {})
        );

        // Save the keys rather than dumping potentially enormous JSON.
        console.log(
          '\n[Test] pageProps structure:'
        );

        console.dir(
          data.props?.pageProps,
          {
            depth: 3,
            maxArrayLength: 3,
          }
        );

      } catch (err) {
        console.error(
          '[Test] Failed to parse __NEXT_DATA__:',
          err.message
        );
      }
    } else {
      console.log('\n[Test] No __NEXT_DATA__ found.');
    }

  } catch (err) {
    console.error('\n[Test] Request failed.');

    if (err.response) {
      console.error('HTTP status:', err.response.status);
      console.error('Response length:', err.response.data?.length);
    }

    console.error('Error:', err.message);
  }
}

main();
