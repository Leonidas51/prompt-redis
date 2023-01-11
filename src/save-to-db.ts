import { createClient } from 'redis';
import { PromptData } from 'src';

// Вариант 1

  // prompts Set = ['ни', 'ст', 'тел'] - max len: 200
  // ни:words-ids Set = ['1', '2'] - max len: 12000
  // word:1 = паяльник
  // word:2 = понедельник

  // берем рандомный SRANDMEMBER из prompts ('ни')
  // юзер отправляет слово ('паяльник')
  // берем все words-ids по SMEMBERS ни:words-ids
  // берем все words по for (word-id of words-ids) -> GET word:word-id
  // сверяем слово юзера с получившимся массивом

// Вариант 2
  // prompts Set = ['ни', 'ст', 'тел' ...]  - max len: 200
  // паяльник:prompts = ['па', 'ая', 'ль' ...] - max len ~40

  // берем рандомный SRANDMEMBER из prompts ('ни')
  // юзер отправляет слово ('паяльник')
  // берем все prompts SMEMBERS паяльник:prompts
  // смотрим что в этом списке есть наш текущий prompt ('ни')

// Вариант 3 - делаем так +++++
  // паяльник:prompts = ['па', 'ая', 'ль' ...] - max len ~40
  // prompt:1 = 'ни', prompt:2 = 'ст' ... prompt:500 = 'ль'
  // prompt-count = 500
  // На инициализации игры создаем range массив [1, 2, ... , prompt-count]
  // Шаффлим массив, после чего наполняем из базы (получается ['ль', 'ст', 'ни' ...])
  // Берем промпты по порядку
  // Дальше как в Вариант 2:
  // юзер отправляет слово ('паяльник')
  // берем все prompts SMEMBERS паяльник:prompts
  // смотрим что в этом списке есть наш текущий prompt

export const saveToDb = async (prompts: PromptData[], words: Record<string, string[]>) => {
  const client = createClient();
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  let promises: Promise<any>[] = [];

  for (const key in words) {
    promises.push(client.sAdd(`${key}:prompts`, words[key]));
  }

  for (const prompt of prompts) {
    promises.push(client.sAdd('prompts', prompt.text));
  }

  await Promise.all(promises);

  await client.disconnect();
  
  console.log('disconnected');
}
