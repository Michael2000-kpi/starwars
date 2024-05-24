import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import App from "./App";
import Card from "./Card";

const Routes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={App} />
        <Route path="/card/:name" component={Card} />
      </Routes>
    </Router>
  );
};

export default Routes;
