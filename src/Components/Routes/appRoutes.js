// routes.js
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import BtaasTab from "../Btaas/navbar/Navbar";
import BtaasSetupForm from "../Btaas/setup/BtaasSetupForm";


const AppRoutes = () => {
  const { repoList } = useSelector((state) => state.btaasTestData);
  const {projects} = useSelector((state) => state.btaasGitLab);
  const {azureRepo} = useSelector((state) => state.azureBtass);
  const { repoToBeUsed } = useSelector((state) => state.btaasGitLab);



  return (
    <Routes>
      <Route path="/btaas/setup" element={<BtaasSetupForm />} />
      {/* <Route
        path="/"
        element={repoList || projects || azureRepo || (repoToBeUsed==="Other") ? <BtaasTab /> : <BtaasSetupForm />}
      /> */}
      <Route
        path="/btaas"
        // element={repoList || projects || azureRepo || (repoToBeUsed==="Other") ? <BtaasTab /> : <BtaasSetupForm />}
        element={<BtaasTab />}
      />
      <Route
        path="/"
        // element={repoList || projects || azureRepo || (repoToBeUsed==="Other") ? <BtaasTab /> : <BtaasSetupForm />}
        element={<BtaasTab />}
      />
    </Routes>
  );
};

export default AppRoutes;
