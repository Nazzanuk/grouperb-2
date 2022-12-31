// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

type Data = {
  name: string;
};


const directoryPath = path.join(process.cwd(), './public/img/avatars');

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  console.log({directoryPath})
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

    res.status(200).json({ avatars: files });
  });
}
