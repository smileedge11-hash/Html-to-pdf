import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.use(express.json({ limit: "20mb" }));

app.post("/generate-pdf", async (req, res) => {
  try {
    const { html } = req.body;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0"
    });

    await new Promise(r => setTimeout(r, 5000));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);

  } catch (e) {
    res.status(500).send(e.toString());
  }
});

app.listen(process.env.PORT || 3000);
