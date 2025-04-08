import fs from "fs";
import { chromium } from "playwright";
import Papa from 'papaparse';

const chunkSize = 42;
let start = 1;
/* const end = 50; */
const end = 3497;

// Generar un array con los números desde 0 hasta 3352
const numbers = Array.from({ length: end - start + 1 }, (_, i) => i);

// Dividir en bloques de 41 elementos
let positionElementsByPage = [];
for (let i = start; i < numbers.length; i += chunkSize) {
  positionElementsByPage.push(numbers.slice(i, i + chunkSize));
}

//positionElementsByPage[0]=[1,2];



(async () => {
    // Lanzar navegador en modo headless
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 }
  });
    const page = await context.newPage();


    //hay que recorrer 151 pages of 42 elements
    // Ir a la URL del producto
//    await page.goto("https://animalia.bio/es/mammals");
      await page.goto("https://animalia.bio/es/fish");
      //await page.goto("https://animalia.bio/es/birds");
      //await page.goto("https://animalia.bio/es/amphibia");
      //await page.goto("https://animalia.bio/es/reptiles");
      
    /* await page.click("div.paginator > div.load-more-container > span") */
    

    while (positionElementsByPage?.length) {
      start=start+1
      const positionElementsByChunk = positionElementsByPage.shift()

      const elemets = positionElementsByChunk.map(elementNo=>`//a[contains(@class,'animals-invert__item')][${elementNo}]`)
      await Promise.all(
        elemets.map(selector=> page.waitForSelector(selector ,{ timeout: 1000*60*5 }))
      )

      //a[contains(@class,'animals-invert__item')]
      const selectorPath0 = `//a[contains(@class,'animals-invert__item')]`          
      const links = await page.$$eval(selectorPath0, anchors => anchors.map(a => a.href));

      //console.log({links, l:links?.length});
      

      while (positionElementsByChunk?.length) {
        
        const elementNo = positionElementsByChunk.shift()

        try {
          
          /* const selectorPath = `//a[contains(@class,'animals-invert__item')][${elementNo}]`
          
          

          const links = await page.$$eval(selectorPath, anchors => anchors.map(a => a.href));
          
          console.log({elementNo,elementNoData:elementNo[0] ,links, selectorPath}); */
          
          //if(!links || !links[0]) throw new Error("fail")//continue
  
          //const linkA = await page.locator('a.mi-enlace').getAttribute('href');
          const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1280, height: 720 }
          });
          const newPage = await context.newPage();
          //const newPage = await browser.newContext().context().newPage(); // Abre una nueva pestaña
          await newPage.goto(links[elementNo]);


//          await page.goto(links[elementNo]);
  
  
          
          const title = await newPage.locator("//h1[contains(@class,'a-h1')]").textContent()
          let mating = await newPage.locator("//section[contains(@class,'s-mating')]/div/div/div/div/div/p")
          .allInnerTexts()
          let appearance = await newPage.locator("//section[contains(@class,'s-appearance')]//div//div//p")
            .allInnerTexts()
          const habbitContent1 = await newPage.locator('div.s-habbit-content > p').allInnerTexts();
          const habbitContent2 = await newPage.locator('div.s-habbit-content > span > p').allInnerTexts();
          appearance= appearance.filter(data=>data.trim()).join(" ");
          mating= mating.filter(data=>data.trim()).join(" ");
          const habbit = habbitContent1.concat(habbitContent2).filter(data=>data.trim()).join(" ");
  
          const dataTxt =[appearance,habbit,mating].join(" ")
          //console.log(dataTxt)
          
	        if(dataTxt.trim())
            fs.appendFileSync("./fish.txt", "\r\n"+ dataTxt, 'utf8');
          if(habbit.trim() && appearance.trim() && mating.trim())
            fs.appendFileSync("./fish.csv", 
              "\r\n"+Papa.unparse(
                [
                  [title.trim(), elementNo,"habbit",habbit],
                  [title.trim(), elementNo,"appearance",appearance],
                  [title.trim(), elementNo,"mating",mating],
                  /* ["title",title],
                  ["elementNo",elementNo] */
                ],
                {
                  quotes: false, //or array of booleans
                  quoteChar: '"',
                  escapeChar: '"',
                  delimiter: ",",
                  header: true,
                  newline: "\r\n",
                  skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
                  columns: null
                }
              ), 'utf8');
            
          console.log(`Item ${elementNo} de ${end}`);
          
          // await page.goBack(); 
          
          await newPage.close(); // Cierra la nueva pestaña
        } catch (error) {
          console.error(error, "error try----------------")
          //if(!links || !links[0]) throw new Error("fail")//continue
        }

      }    

      let distinto = false
      do {
        // el resultado ver separar el contenido textual y ver si coincide con el numero que le toca.
        await page.click("div.paginator > div.load-more-container > span",{ timeout: 1000*60*5 })
          .catch((error=>{
            console.log(error, "error click");
          }))

        const textButton = await page.locator("div.paginator > div.load-more-container > span").textContent()

        const [,,numeroElement] = textButton.trim().split(" ")

        distinto = false
        if(parseInt(numeroElement)  < chunkSize*start)
          distinto = true

        console.log({textButton,distinto,numeroElement, "chunkSize*start":chunkSize*start });
        
      } while (distinto);

     /*  await new Promise((res,reje)=>{
        setTimeout(() => {
          console.log("listo");
          res(true)
        }, 10*1000);
      }) */
    }
    

    console.log("-------------------------------------CERRADA");
    
    await browser.close();
})();
