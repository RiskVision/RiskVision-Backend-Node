const VulnerabilityScanner = require("./services/cve-nvd.service");

//Los elements son los parametros que van a salir de la base de datos de assets digitales, siendo la marca y sistemas operativos principalmente 
const elementsToScan = ['Apache Kylin']; 
const scanner = new VulnerabilityScanner(elementsToScan);

(async () => {
    await scanner.start().then(results => {
        console.log('Final Results:', results);
    });
})();