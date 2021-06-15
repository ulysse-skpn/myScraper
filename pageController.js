const pageScraper = require('./pageScraper')
const fs = require('fs')

async function scrapeAll(browserInstance)
{
    let browser;
    try 
    {
       browser = await browserInstance
       const data = await pageScraper.scraper(browser) 
       await browser.close()
       fs.writeFileSync("data.json" , JSON.stringify(data) , 'utf8' , (err) => {
           if(err) return console.log(err)
       })
       console.log("Les données ont été moissonné et sauvegardé dans './data.json'");
    } 
    catch (error) 
    {
        console.log("L'instance de navigateur n'a pas aboutie => :" , error);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)