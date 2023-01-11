export const createPrompts = (word: string) => {
  const result = [];

  for (let i = 0; i <= word.length - 2; i++) {
    result.push(`${word[i]}${word[i + 1]}`);
  }

  for (let i = 0; i <= word.length - 3; i++) {
    result.push(`${word[i]}${word[i + 1]}${word[i + 2]}`);
  }

  for (let i = 0; i <= word.length - 4; i++) {
    result.push(`${word[i]}${word[i + 1]}${word[i + 2]}${word[i + 3]}`);
  }

  return result;
}