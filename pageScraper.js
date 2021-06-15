const scraperObject = {
    url: "https://www.cuisine-libre.org/recettes",
    async scraper(browser)
    {
        const page = await browser.newPage()
        console.log(`Navigation vers ${this.url}...`)
        await page.goto(this.url)

        let scrapedData = []

        //Loop on the categories links
        await page.waitForSelector("#content")
        const _urls = await page.$$eval('.summary > div' , links => {
            //Extract the links from the data
            links = links.map(el => el.querySelector("a.tag").href)
            return links
        })

        async function scrapeCurrentPage()
        {
            const _pagePromise = (link) => new Promise(async(resolve,reject) => {
                const dataObj = {}
                const newPage = await browser.newPage()
                await newPage.goto(link)
    
                await newPage.waitForSelector(".main")
                 try 
                 {
                    if (await newPage.$('header > h1')) dataObj['title'] = await newPage.$eval('header > h1' , text => text.textContent)
                    if (await newPage.$('.prepTime > time')) dataObj['prep'] = await newPage.$eval('.prepTime > time' , text => text.textContent)
                    if(await newPage.$('.cookTime > time')) dataObj['cookingTime'] = await newPage.$eval('.cookTime > time' , text => text.textContent)
                    if(await newPage.$('.duree_repos > time')) dataObj['rest'] = await newPage.$eval('.duree_repos > time' , text => text.textContent)
                    // if(await newPage.$('span > a')) dataObj['cookingMethod'] = await newPage.$eval('span > a' , text => text.textContent)
                    if(await newPage.$('#tags > p > a')) dataObj['categories'] = await newPage.$$eval('#tags > p > a' , text => {
                        text = text.map(t => t.textContent)
                        return text
                    })
                    if(await newPage.$('#ingredients > div > ul > li')) dataObj['ingredients'] = await newPage.$$eval('#ingredients > div > ul > li' , text => {
                        text = text.map(t => t.textContent)
                        return text
                    })
                    if(await newPage.$('.quiet > span')) dataObj['serving_size'] = await newPage.$eval('.quiet > span' , text => text.textContent)
                    if(await newPage.$('#preparation > div > p')) dataObj['instructions'] = await newPage.$$eval('#preparation > div > p' , text => {
                        text = text.map(t => t.textContent)
                        return text
                    })   
                    if(await newPage.$('img.photo')) dataObj['image'] = await newPage.$eval('img.photo' , img => img.src )
                 } 
                 catch (error) 
                 {
                     throw error
                 }
                resolve(dataObj)
                await newPage.close()
            })

    
            for(let link of _urls)
            {
                await page.goto(link)

                //Get the number of elements on the page
                await page.waitForSelector("#ui-tabs")
                const _nbElements = await page.$eval('ul> li > a > small' , nb => nb.textContent)
                const nbElements = Number(_nbElements.slice(1,(_nbElements.length-1)));
                
                link = link + `?max=${nbElements}`
                await page.goto(link)

                await page.waitForSelector("#recettes")
                

                const newUrls = await page.$$eval("ul > li > div" , links => {
                    links = links.filter(el => el.querySelector("a").className !== "external")
                    links = links.map(el => el.querySelector("a").href)
                    return links
                })
                
                
    
                for(const link in newUrls)
                {   
                    const currentPageData = await _pagePromise(newUrls[link]) 
                    scrapedData.push(currentPageData)
                    console.log(currentPageData)
                }
            }

            await page.close()
            return scrapedData
        }
        const data = await scrapeCurrentPage()
        return data
    }
}

module.exports = scraperObject