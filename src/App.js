import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";

import SearchPaginationTable from "./components/SearchPaginationTable";
import RowDetails from "./components/RowDetails";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={SearchPaginationTable} />
          <Route exact path="/row-details/:id" component={RowDetails} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
