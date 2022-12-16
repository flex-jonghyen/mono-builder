type Params<T> = {
  promises: Promise<T>[];
  chunk: number;
};

export const chunkPromiseAll = <T>({ promises, chunk }: Params<T>) => {
  const chunks = Array.from(
    { length: Math.ceil(promises.length / chunk) },
    (_, i) => promises.slice(i * chunk, i * chunk + chunk)
  );

  return Promise.all(
    chunks.map((chunk) => Promise.all(chunk).then((results) => results.flat()))
  );
};
