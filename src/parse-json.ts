import fs from 'fs';

export const parseJson = () => {
  const rawData = fs.readFileSync('./data.json', 'utf8');
  const data = JSON.parse(rawData);
  return Object.keys(data);
}
