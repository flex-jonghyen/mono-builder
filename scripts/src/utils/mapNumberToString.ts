const tokens = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const mapNumberToString = (seed: number): string => {
  if (!Number.isFinite(seed)) {
    throw Error("[mapNumberToString]: `seed`로 들어온 숫자가 이상합니다.");
  }

  let charators = [];
  let remain = seed;

  do {
    const at = remain % tokens.length;
    const token = tokens.at(at);
    charators.push(token);

    remain = remain - tokens.length;
  } while (remain >= 0);

  return charators.join("");
};
