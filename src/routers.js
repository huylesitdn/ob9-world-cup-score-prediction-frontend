import * as React from "react";

const Home = React.lazy(() => import('pages/Home'));


const routers = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:slug",
    element: <Home />,
  },
  {
    path: "*",
    element: "Not Found",
  },
];
export default routers;