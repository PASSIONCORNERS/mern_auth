import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout/AuthLayout";
import ProfileLayout from "./Layouts/ProfileLayout/ProfileLayout";
import ResetLayout from "./Layouts/ResetLayout/ResetLayout";

function App() {
  const isLoggedIn = false;

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          component={isLoggedIn ? ProfileLayout : AuthLayout}
        />
        <Route
          path="/auth/reset-password/:token"
          exact
          component={ResetLayout}
        />
      </Switch>
    </Router>
  );
}

export default App;
