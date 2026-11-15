import { Render, type Data } from "@measured/puck";
import config from "./config";

export default function PageView({ data }: { data: Data }) {
  return <Render config={config} data={data} />;
}
