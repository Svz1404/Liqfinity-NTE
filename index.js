import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Solver } from "@2captcha/captcha-solver";
import readline from "readline";
import cfonts from "cfonts";
import chalk from 'chalk';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

// Initialize 2Captcha Solver with your API key
const solver = new Solver("653ea57b731639a8d68257d579f1ae9d");
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

// Define the injected script to intercept CAPTCHA parameters
const injectScript = `
console.clear = () => console.log('Console was cleared');
window.stopTurnstile = false; // A flag to stop the script
const i = setInterval(() => {
    if (window.stopTurnstile) {
        clearInterval(i); // Stop the interval if the flag is set
        return;
    }
    if (window.turnstile) {
        clearInterval(i);
        window.turnstile.render = (a, b) => {
            let params = {
                sitekey: b.sitekey,
                pageurl: window.location.href,
                data: b.cData,
                pagedata: b.chlPageData,
                action: b.action,
                userAgent: navigator.userAgent,
                json: 1
            };
            console.log('intercepted-params:' + JSON.stringify(params));
            window.cfCallback = b.callback; // Store the callback globally
            return;
        };
    }
}, 50);
`;

(async () => {
  cfonts.say('NT Exhaust', {
    font: 'block',
    align: 'center',
    colors: ['cyan', 'magenta'],
    background: 'black',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
  });

  console.log(chalk.green("=== Telegram Channel : NT Exhaust ( @NTExhaust ) ===\n"));
  try {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
      headless: false,
      devtools: false,
    });

    const [page] = await browser.pages();
    await page.evaluateOnNewDocument(injectScript);

    let captchaSolved = false; // Track if CAPTCHA has been solved

    page.on("console", async (msg) => {
      if (captchaSolved) return; // Skip if CAPTCHA is already solved

      const txt = msg.text();
      if (txt.includes("intercepted-params:")) {
        const params = JSON.parse(txt.replace("intercepted-params:", ""));
        console.log("Intercepted CAPTCHA parameters:", params);

        try {
          console.log(`Solving the CAPTCHA with 2Captcha...`);
          const res = await solver.cloudflareTurnstile(params);
          console.log(`CAPTCHA solved. Token: ${res.data}`);

          await page.evaluate((token) => {
            cfCallback(token);
          }, res.data);

          captchaSolved = true; // Mark CAPTCHA as solved
          console.log("Token submitted successfully. Proceeding with automation...");
          // You can continue automating further steps as needed.
          console.log("Automation resumed after CAPTCHA solving.");
        } catch (e) {
          console.error("Error solving CAPTCHA:", e.message);
        }
      }
    });

    // Navigate to the target page
    console.log("Navigating to the target page...");
    await page.goto("https://app.testnet.liqfinity.com/sign-in", {
      waitUntil: "networkidle2",
    });
    const age = await askQuestion('Enter it If you already Log In');
    // Continue automation after CAPTCHA is solved
    var i =''
    for(i =0;i <100000;i++){
        try{
    await delay(5000); // Optional delay
    await page.goto("https://app.testnet.liqfinity.com/user/stakes", {
      waitUntil: "networkidle2",
    });
    await delay(25000)
    await page.waitForSelector('xpath=//button[contains(text(), "Lock")]', { timeout: 60000 });
    await page.click(`xpath=//button[contains(text(), "Lock")]`)
    await delay(3000)
    // await page.waitForSelector(`#root > div > div > div.flex.flex-col.flex-auto.min-h-screen.min-w-0.relative.w-full.bg-white.dark\:bg-black > div > main > div > div.flex.flex-col.gap-4 > div > div:nth-child(1) > div.flex.flex-col.gap-2 > div.grid.grid-cols-1.lg\:grid-cols-3.xl\:grid-cols-3.gap-2 > div:nth-child(1) > div > div > header > div.flex.gap-2 > button:nth-child(1)`,{timeout:60000})
    // await page.click(`#root > div > div > div.flex.flex-col.flex-auto.min-h-screen.min-w-0.relative.w-full.bg-white.dark\:bg-black > div > main > div > div.flex.flex-col.gap-4 > div > div:nth-child(1) > div.flex.flex-col.gap-2 > div.grid.grid-cols-1.lg\:grid-cols-3.xl\:grid-cols-3.gap-2 > div:nth-child(1) > div > div > header > div.flex.gap-2 > button:nth-child(1)`)
    // await delay(2000)

    await page.waitForSelector('xpath=//input[@class="input input-md h-11 focus:border-white" and @name="amount" and @placeholder="Enter amount"]')
    await page.type('xpath=//input[@class="input input-md h-11 focus:border-white" and @name="amount" and @placeholder="Enter amount"]','100000')
    // await page.waitForSelector('xpath=//span[@class="button__value" and text()="75%"]',{timeout:60000})
    // await page.click('xpath=//span[@class="button__value" and text()="75%"]')
    await delay(3000)

    await page.waitForSelector('xpath=/html/body/div[3]/div/div/div/form/div/button',{timeout:60000})
    await page.click('xpath=/html/body/div[3]/div/div/div/form/div/button')

    await delay(3000)
    await page.waitForSelector('xpath=//button[text()="Confirm" and contains(@class, "button") and contains(@class, "font-medium")]',{timeout:60000})
    await page.click('xpath=//button[text()="Confirm" and contains(@class, "button") and contains(@class, "font-medium")]')

    await delay(3000)
    ////p[text()='Liquidity has been successfully added.' and contains(@class, 'text-white/40')]
    await page.waitForSelector('xpath=/html/body/div[3]/div/div/div/button',{timeout:60000})
    await page.click('xpath/html/body/div[3]/div/div/div/button')
    await delay(5000)
    await page.goto("https://app.testnet.liqfinity.com/user/stakes", {
        waitUntil: "networkidle2",
      });
    await delay(20000)

    await page.waitForSelector('xpath=//button[text()="Unlock" and contains(@class, "button")]',{timeout:60000})
    await page.click('xpath=//button[text()="Unlock" and contains(@class, "button")]')
    await delay(2000)

    await page.waitForSelector('xpath=//input[@class="input input-md h-11 focus:border-white" and @name="amount" and @placeholder="Enter amount"]')
    await page.type('xpath=//input[@class="input input-md h-11 focus:border-white" and @name="amount" and @placeholder="Enter amount"]','99999')
    // await page.waitForSelector('xpath=//span[text()="MAX" and contains(@class, "button__value")]',{timeout:60000})
    // await page.click('xpath=//span[text()="MAX" and contains(@class, "button__value")]')
    await delay(2000)

    await page.waitForSelector('xpath=/html/body/div[4]/div/div/div/form/div/button',{timeout:60000})
    await page.click('xpath=/html/body/div[4]/div/div/div/form/div/button')
    await delay(3000)

    await page.waitForSelector('xpath=//button[text()="Confirm" and contains(@class, "button") and contains(@class, "bg-indigo-600")]',{timeout:60000})
    await page.click('xpath=//button[text()="Confirm" and contains(@class, "button") and contains(@class, "bg-indigo-600")]')
    await delay(3000)
    
    ////p[text()="Liquidity removed." and contains(@class, "text-white/40")]

    await page.waitForSelector('xpath=/html/body/div[4]/div/div/div/button',{timeout:60000})
    await page.click('xpath=/html/body/div[4]/div/div/div/button')
    await delay(3000)
}catch{}
    }

  } catch (error) {
    console.error("Error occurred:", error);
  }
})();
