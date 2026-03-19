const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // Wait for React to render
  await new Promise(r => setTimeout(r, 1000));
  
  // click the first project card
  const cards = await page.$$('.cursor-pointer');
  if (cards.length > 0) {
    console.log('Clicking card...');
    await cards[0].click();
    await new Promise(r => setTimeout(r, 2000));
  } else {
    console.log('No cards found');
  }

  await browser.close();
})();
