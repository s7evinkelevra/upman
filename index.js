const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const cron = require('node-cron');


const sites = [
  "http://brkhnudd.myraidbox.de/",
  "http://b3mfy0.myraidbox.de/",
  "http://b3mfy0.myraidbox.de/",
  "https://ganteroptik.de/",
  "https://augenoptik-sabrina-buhl.de/",
  "https://luedemann2.de/",
  "https://zahnarztpraxis-andrzejewski.com/",
  "https://eyeworks-store.de/",
  "https://bremen-optiker.de/",
  "https://dienstleistungen-schroeder.de/",
  "https://rasenservice-luedemann.de/",
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

const ignoredFileTypes = [
  "mp4",
  "woff2",
  "woff",
  "ttf"
]


let transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix'
});

const main = async () => {
  console.log("scan starting")
  // quick hack, make sure added items are unique
  const fdSites = new Set();
  try{
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser'
    });

    const page = await browser.newPage();

    await page.on('requestfailed', (request) => {
      // do nothing if the filename contains mp4 since mp4 encoders are not shipped by puppeteer
      const filetype = request.url().split(".").pop();
      if (ignoredFileTypes.includes(filetype)) return;

      console.log(`${request.failure().errorText} ${request.url()}`)
      fdSites.add(request.headers().referer);
    });

    // basically running synchronously
    for (const site of sites) {
      console.log(`navigating to ${site}`)
      try{
        await page.goto(site, {
          waitUntil: 'networkidle2'
        });
      }catch(err) {
        console.log(err);
      }
    }

    await browser.close();
    console.log("closing browser");

  }catch(err){
    console.log("ERRRRR");
    console.log(err);
  }

  console.log(`found ${fdSites.size} broken sites`)


  if(fdSites.size > 0) {
    const text = `Kaputte Seiten (cache):\n${[...fdSites].join('\n')}`;

    console.log("reporting broken sites")
    console.log(text);
    // spread items to array since sets cant be joined like that

    transporter.sendMail({
      from: 'derraspberry@pi.com',
      to: ['info@luedemann2.de', 'kelevra.1337@gmail.com'],
      subject: 'Eine oder mehrere Seiten sind kaputt',
      text
    }, (err, info) => {
      console.log(info.envelope);
      console.log(info.messageId);
    });
  }
};

main();

cron.schedule('0 */6 * * *', async () => {
  main();
})
