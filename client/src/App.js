import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout/AuthLayout";
import ProfileLayout from "./Layouts/ProfileLayout/ProfileLayout";

function App() {
  const isLoggedIn = true;

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          component={isLoggedIn ? ProfileLayout : AuthLayout}
        />
      </Switch>
    </Router>
  );
}

export default App;
