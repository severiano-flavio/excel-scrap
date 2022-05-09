const puppeteer = require("puppeteer");
const readExcel = require("./reader");
const exportUsersToExcel = require("./write");

const calculateEarning = async () => {
  const papers = await readExcel.getPapers();
  const filterFifity = papers.slice(0, 250);
  const calculator = [];

  for await (let paper of filterFifity) {
      console.log("buscando o papel ", paper)
;    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://fundamentus.com.br/detalhes.php?papel=${paper}`);

    const pageData = await page.evaluate(() => {
      return {
        firma: document.querySelector(
          "body > div.center > div.conteudo.clearfix > table:nth-child(3) > tbody > tr:nth-child(2) > td.data.w3 > span"
        ).innerText,
        ebit: document.querySelector(
          "body > div.center > div.conteudo.clearfix > table:nth-child(6) > tbody > tr:nth-child(4) > td:nth-child(4) > span"
        ).innerText,
      };
    });

    await browser.close();

    const firma = parseInt(pageData.firma.replace(/\./g, ""));
    const ebit = parseInt(pageData.ebit.replace(/\./g, "")) * 4;

    const earning = ((ebit / firma) * 100).toFixed(2) + "%";

    calculator.push({
      paper,
      earning,
    });
  }

  const workSheetColumnName = ["Papel", "Earning Yield"];

  const workSheetName = "calculos";
  const filePath = "./excel-from-js.xlsx";

  exportUsersToExcel(calculator, workSheetColumnName, workSheetName, filePath);

  console.log("Tabela criada");
};

calculateEarning();
