// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import '../../src/Utils/Seed';

import fs from 'fs';
import path from 'path';
import Chance from 'chance';

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

    var chance1 = new Chance(124); // you can choose a seed here, i chose 124 
    console.log(chance1.shuffle(['alpha', 'bravo', 'charlie', 'delta', 'echo']));
    // Array [ "alpha", "delta", "echo", "charlie", "bravo" ]

    res.status(200).json({ avatars: chance1.shuffle(files) });
  });
}

