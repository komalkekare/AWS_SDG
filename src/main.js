import { Provider } from "react-redux";
import store from "./Components/Store/store";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Components/Header/Navbar";
import Footer from "./Components/Footer/Footer";
import AppRoutes from "./Components/Routes/appRoutes";


function App() {
  return (
    <Provider store={store}>
      <React.Fragment>
        <Router>
          <Navbar />
          <AppRoutes/>
          <Footer />
        </Router>
      </React.Fragment>
    </Provider>
  );
}

export default App;
