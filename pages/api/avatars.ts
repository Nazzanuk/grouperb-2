// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import '../../src/Utils/Seed';

import fs from 'fs';
import path from 'path';

// import shuffle from 'lodash/shuffle';
import type { NextApiRequest, NextApiResponse } from 'next';

console.log('shuffle');

type Data = {
  name: string;
};

const directoryPath = path.join(process.cwd(), './public/img/avatars');

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log({ directoryPath });
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      res.status(200).send('Unable to scan directory: ');
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      console.log(file);
    });

    res.status(200).json({ avatars: shuffle(files) });
  });
}

function shuffle(array, seed) {
  // <-- ADDED ARGUMENT
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(random(seed) * m--); // <-- MODIFIED LINE

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed; // <-- ADDED LINE
  }

  return array;
}

function random(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
