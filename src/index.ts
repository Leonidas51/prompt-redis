// Data credit: https://github.com/Harrix/Russian-Nouns

import { parseJson } from './parse-json';
import { createPrompts } from './create-prompts';
import { saveToDb } from './save-to-db';

export type PromptHash = Record<string, { count: number; wordsIds: number[] }>

export type PromptData = {
  text: string,
  count: number,
  wordsIds: number[],
};

const main = (words: string[]) => {
  const resultPrompts: PromptHash = {};

  for (let i = 0; i < words.length; i++) {
    const prompts = createPrompts(words[i]);

    for (const prompt of prompts) {
      if (resultPrompts[prompt]) {
        resultPrompts[prompt].count++;
        resultPrompts[prompt].wordsIds.push(i);
      } else {
        resultPrompts[prompt] = {
          count: 1,
          wordsIds: [i],
        }
      }
    }
  }

  let promptHashes: PromptData[] = [];
  for (const key of Object.keys(resultPrompts)) {
    const prompt = resultPrompts[key];

    promptHashes.push({
      text: key,
      count: prompt.count,
      wordsIds: prompt.wordsIds,
    });
  }

  console.log('created', Object.keys(promptHashes).length, 'prompts');

  promptHashes = promptHashes.sort((a, b) => a.count > b.count ? -1 : 1).slice(0, 300);

  const wordsFiltered: Record<string, string[]> = {};
  
  for (const prompt of promptHashes) {
    for (const wordId of prompt.wordsIds) {
      if (wordsFiltered[words[wordId]]) {
        wordsFiltered[words[wordId]].push(prompt.text);
      } else {
        wordsFiltered[words[wordId]] = [prompt.text];
      }
    }
  }

  saveToDb(promptHashes, wordsFiltered);
}

main(parseJson());
