import { configureStore } from "@reduxjs/toolkit";
import testDataReducer from "./Action/Btaas/testDataSlice";
import githubDataSlice from "./Action/Btaas/githubSlice";
import GitLabSlice from "./Action/Btaas/GitLab/GitLab.slice";
import AzureDirectorySlice from './Action/Btaas/Azure/Azure.slice';




const store = configureStore({
  reducer: {
    btaasTestData: testDataReducer,
    btaasGithubData: githubDataSlice,
    btaasGitLab: GitLabSlice,
    azureBtass: AzureDirectorySlice
  },
});

export default store;

