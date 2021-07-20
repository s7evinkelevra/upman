const puppeteer = require('puppeteer');
const sanitize = require('sanitize-filename');

const sites = [
  "http://brkhnudd.myraidbox.de/",
  "http://b2rzk986.myraidbox.de/",
  "http://b3mfy0.myraidbox.de/",
  "http://b3mfy0.myraidbox.de/",
  "https://ganteroptik.de/",
  "https://augenoptik-sabrina-buhl.de/",
  "https://luedemann2.de/",
  "https://zahnarztpraxis-andrzejewski.com/",
  "https://eyeworks-store.de/",
  "https://fenster-aufmass-richtig.de/",
  "https://fenster-guenstig-sanieren.de/",
  "https://bremen-optiker.de/",
  "https://dienstleistungen-schroeder.de/",
  "https://rasenservice-luedemann.de/",
  "https://mein-fenster-klemmt.de/",
  "https://eunomia-inkasso.de/",
  "https://berufseinstieg-bundeswehr.de/",
  "https://oralchirurgie-westerwald.de/",
  "https://dr-wiechert.com/",
  "https://newport-optik.de/",
  "https://lehrerversorgung.info/",
  "https://holzwerkstatt-pfaff.de/",
  "https://fit4bpol.de/",
  "https://vas-medicus.de/"
];


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.on('requestfailed', (request) => {
    // do nothing if the filename contains mp4 since mp4 encoders are not shipped by puppeteer
    if(request.url().split(".").pop() === "mp4") return;
/*     console.log(request); */
    console.log(`${request.failure().errorText} ${request.url()}`)
  });

  for (const site of sites) {
    await page.goto(site, {
      waitUntil: 'networkidle2'
    });
  }

  await browser.close();

})();