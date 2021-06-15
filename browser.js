const puppeteer = require('puppeteer')

//* headless
//* signifie que le navigateur s'exécutera avec une Interface qui vous permet de regarder votre script s'exécuter, tandis que true signifie que le navigateur s'exécutera en mode headless

//*ignoreHTTPSErrors
//* permet de consulter des sites web qui ne sont pas hébergés sur un protocole HTTPS sécurisé et ignorent les erreurs liées à HTTPS

async function startBrowser()
{   
    let browser;
    try 
    {
        console.log("Ouverture du navigateur...")
        browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox"], "ignoreHTTPSErrors": true
        })
    } catch (error) 
    {
       console.log("Création d'instance de navigateur échouée => : " , error)
    }
    return browser
}

module.exports = { startBrowser }