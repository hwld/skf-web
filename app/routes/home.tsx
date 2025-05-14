import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "skf-web" }, { name: "description", content: "skf-web" }];
}

export default function Home() {
  return <div></div>;
}
