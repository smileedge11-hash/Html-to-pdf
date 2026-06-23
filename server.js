import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("HTML TO PDF SERVER RUNNING");
});

app.post("/generate-pdf", async (req, res) => {
  try {

    const html = req.body.html;

    if (!html) {
      return res.status(400).send("HTML missing");
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1400,
      height: 2000
    });

    await page.setContent(html, {
      waitUntil: "networkidle0"
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    return res.send(pdf);

  } catch (err) {

    console.error(err);

    return res
      .status(500)
      .send(err.toString());

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
