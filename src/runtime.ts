import path from "node:path";

/** Runtime data is separate from source/assets so tests never write the real store. */
export const dataRoot = path.resolve(process.env.EXAM_DATA_ROOT ?? path.join(process.cwd(), "data"));
export const offline = process.env.STUDY_OFFLINE === "1";
export const host = process.env.HOST ?? (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
export const dataPath = (...segments: string[]) => path.join(dataRoot, ...segments);
