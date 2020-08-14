import React from 'react';
import logo from './logo.svg';
import './App.css';
import ClowderTable from './ClowderTable.js'
import STViewer from './STViewer.js'
import {BrowserRouter, Link, Switch, Route} from "react-router-dom";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import AppBar from "@material-ui/core/AppBar";
import LocationEditor from "./LocationEditor";
import ThingEditor from "./ThingEditor";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
                <div>
                  <AppBar position="static" color="default">
                    <Tabs
                        // value={this.state.value}
                        // onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                    >
                      <Tab label="STView" component={Link} to="/stview" />
                      <Tab label="Location Edit" component={Link} to="/locationedit" />
                      <Tab label="Thing Edit" component={Link} to="/thingedit" />
                      <Tab label="QC" component={Link} to="/qc" />
                    </Tabs>
                  </AppBar>

                  <Switch>

                    <Route path="/stview">
                      <STViewer />
                    </Route>
                    <Route path="/locationedit">
                      <LocationEditor />
                    </Route>
                    <Route path="/thingedit">
                      <ThingEditor />
                    </Route>
                    <Route path="/qc">
                      <ClowderTable />
                    </Route>

                  </Switch>
                </div>
            </BrowserRouter>
    </div>
  );
}

export default App;
