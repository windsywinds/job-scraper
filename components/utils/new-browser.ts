import puppeteer, { Browser } from "puppeteer";

async function initBrowser(): Promise<Browser> {
  console.log("Initializing browser");
  
  const isDockerEnvironment = process.env.DOCKER_ENVIRONMENT === "true";
  const isHeadless = process.env.HEADLESS === "true";

  const browser = isDockerEnvironment
    ? await puppeteer.launch({
        headless: true,
        executablePath: "/usr/bin/chromium-browser",
        args: ["--no-sandbox", "--disable-gpu"],
      })
    : await puppeteer.launch({ headless: isHeadless });

  return browser;
}

export default initBrowser;
