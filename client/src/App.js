import "./styles/app.css"
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
          <div className="app">
              <Switch>
                  <Route path='/:id'>
                      <div>
                          <Toolbar/>
                          <SettingBar/>
                          <Canvas/>
                      </div>
                  </Route>
                  <Redirect to={`f${(+new Date).toString(16)}`}/>
              </Switch>
          </div>
      </BrowserRouter>
  );
}

export default App;
