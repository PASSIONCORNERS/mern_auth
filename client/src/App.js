import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ActivateLayout from "./Layouts/ActivateLayout/ActivateLayout";
import AuthLayout from "./Layouts/AuthLayout/AuthLayout";
import ProfileLayout from "./Layouts/ProfileLayout/ProfileLayout";
import ResetLayout from "./Layouts/ResetLayout/ResetLayout";

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
        <Route
          path="/auth/reset-password/:token"
          exact
          component={ResetLayout}
        />
        <Route
          path="/api/auth/activate/:activate_token"
          exact
          component={ActivateLayout}
        />
      </Switch>
    </Router>
  );
}

export default App;
