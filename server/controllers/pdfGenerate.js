
import MarkdownIt from "markdown-it";
import puppeteer from "puppeteer";

const md = new MarkdownIt();

export const generatePDF = async (req, res) => {
  try {
    const { markdown } = req.body;
    if (!markdown) return res.status(400).send("Markdown text required!");

    const htmlContent = md.render(markdown);

    // Add custom styling + padding inside the HTML
    const styledHTML = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 20px 30px; /* 👈 adds padding around text */
              line-height: 1.6;
              color: #222;
              font-size: 14px;
            }
            h1, h2, h3 {
              color: #2AA248;
              margin-bottom: 10px;
            }
            p, li {
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(styledHTML, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "14mm",
        bottom: "20mm",
        left: "14mm",
      },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=document.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).send("Failed to generate PDF");
  }
};
