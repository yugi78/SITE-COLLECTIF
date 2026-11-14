import { Render, type Data } from "@measured/puck";
import config from "./config";
import data from "../data/page.json";

export default function PageView() {
  return <Render config={config} data={data as Data} />;
}
