import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGithubBranches,
  fetchGithubSubmitHandle,
  fetchModulesForGithub,
} from "../../Thunk/Btaas/githubThunk";

const initialState = {
  gitBranches: null,
  gitBranchesLoading: false,
  modulesForGit: "",
  testcaseCode: "",
  isTestCodeLoading: null,
  isModuleLoading: null,
};

const githubDataSlice = createSlice({
  name: "btaasGithubData",
  initialState,
  reducers: {
    setTestcaseCode(state, action){
      state.testcaseCode = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGithubBranches.fulfilled, (state, action) => {
      state.gitBranches = action.payload;
      state.gitBranchesLoading = false;
    });
    builder.addCase(fetchGithubBranches.pending, (state) => {
      state.gitBranchesLoading = true;
    });
    builder.addCase(fetchModulesForGithub.fulfilled, (state, action) => {
      state.modulesForGit = action.payload;
      state.isModuleLoading = false;
    });
    builder.addCase(fetchModulesForGithub.pending, (state) => {
      state.isModuleLoading = true;
    });
    builder.addCase(fetchGithubSubmitHandle.fulfilled, (state, action) => {
      state.testcaseCode = action.payload;
      state.isTestCodeLoading = false;
    });
    builder.addCase(fetchGithubSubmitHandle.pending, (state) => {
      state.isTestCodeLoading = true;
    });
  },
});

export const {setTestcaseCode} = githubDataSlice.actions;
export default githubDataSlice.reducer;
