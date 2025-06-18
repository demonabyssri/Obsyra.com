const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const title = document.querySelector('h1')?.innerText || '';
    const price = document.querySelector('.price')?.innerText || '';
    return { title, price };
  });

  await browser.close();
  return data;
}

(async () => {
  const url = 'https://example.com/product';
  const result = await scrapeProduct(url);
  console.log(result);
})();

