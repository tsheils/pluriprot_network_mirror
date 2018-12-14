export const environment = {
  production: true,
/*  dataUrls: [
    '../assets/data/2.5x_up_in_nscs.json', //expression
    '../assets/data/2.5x_up_in_escs.json', //expression
    // '../assets/data/NSC_only.json', //phosphorylation
   //  '../assets/data/ESC_only.json' //phosphorylation
  ],*/

  dataUrls: [
    {
      origin: 'nsc-only',
      url: './assets/data/NSC_only.json' // phosphorylation
    },
    {
      origin: 'esc-only',
      url: './assets/data/ESC_only.json' // phosphorylation
    },
    {
      origin: 'nscs',
      url: './assets/data/2.5x_up_in_nscs.json' // expression
    },
    {
      origin: 'escs',
      url: './assets/data/2.5x_up_in_escs.json' //expression
    }
  ],
  parsedData: './assets/data/data.json'
};
