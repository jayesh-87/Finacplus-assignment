const APP_HOST = 'demoqa.com';

const isAppHost = (hostname) => hostname === APP_HOST || hostname.endsWith(`.${APP_HOST}`);

// why: demoqa's ad iframes and fixed banners overlap the form and table and slow every page load.
export async function blockThirdPartyRequests(page) {
  await page.route('**/*', (route) => {
    const { hostname } = new URL(route.request().url());
    return isAppHost(hostname) ? route.continue() : route.abort();
  });
}
