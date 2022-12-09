const tokens = "abcdefghijklmnopqrstuvwxyz";

export const getFileName = (seed: number): string => {
  if (!Number.isFinite(seed)) {
    throw Error("[mapNumberToString]: `seed`로 들어온 숫자가 이상합니다.");
  }

  let charators = [];
  const at = seed % tokens.length;
  const token = tokens.at(at);
  charators.push(token);
  charators.push(seed);

  return charators.join("");
};
