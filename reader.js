const readExcel = require("read-excel-file/node");

const papers = [];

const getPapers = async () => {
  await readExcel("./tabela.xlsx").then((data) => {
    for (i in data) {
      const [paper] = data.at(i);

      paper !== 'Papel' && papers.push(paper);
 
    }
  });
  
  return papers;
}

module.exports = {
  getPapers
}
