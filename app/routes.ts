import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/app-layout.tsx", [
    index("routes/home.tsx"),
    ...prefix("problem-sets", [
      route("play", "routes/problem-sets/play.tsx"),
      route("create", "routes/problem-sets/create.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
