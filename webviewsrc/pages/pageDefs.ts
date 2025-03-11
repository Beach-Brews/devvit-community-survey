import {InitFromDevvit} from "../devvit/defs";

export type Page =
    | "survey"
    | "configure";

export type PageProps = { initialData: InitFromDevvit };