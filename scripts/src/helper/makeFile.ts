import { fs } from "zx";

export const makeFile = (path: fs.PathLike, contents: unknown) => {
  return fs.writeFile(path, contents).then(() => {
    // console.log(`[makeFile]: ${path} 생성 완료`);
  });
};
