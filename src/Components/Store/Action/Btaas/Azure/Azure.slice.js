import { createSlice } from "@reduxjs/toolkit";
import { fetchAzureAllBranchsForCommit, fetchAzureBranch_File, fetchAzureFileContent, fetchAzureProjects, fetchAzureRepo } from "../../../Thunk/Btaas/Azure/Azure.thunks";

const initialState = {
  azureToken: "",
  azureOrg: "",
  azureProjects: "",
  projectSelected: '',
  isAzureProjectLoading: false,
  azureRepo: "",
  isAzureRepoLoading: false,
  azureBranch_File: "",
  isAzureBranch_FileLoading: false,
  azureFileContent: "",
  azureAllBranchList: [],
  isBranchForAzureLoading: false
};

const azureDirectorySlice = createSlice({
  name: 'azureDetails',
  initialState,
  reducers: {
    setToken_Azure(state, action) {
      state.azureToken = action.payload;
    },
    setOrgNameAzure(state, action) {
      state.azureOrg = action.payload;
    },
    setProjectName(state,action) {
        state.projectSelected = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAzureProjects.pending, (state) => {
        state.isAzureProjectLoading = true;
      })
      .addCase(fetchAzureProjects.fulfilled, (state, action) => {
        state.azureProjects = action.payload;
        state.isAzureProjectLoading = false;
      })
      .addCase(fetchAzureRepo.pending, (state) => {
        state.isAzureRepoLoading = true;
      })
      .addCase(fetchAzureRepo.fulfilled, (state, action) => {
        state.azureRepo = action.payload;
        state.isAzureRepoLoading = false;
      })
      .addCase(fetchAzureBranch_File.pending, (state) => {
        state.isAzureBranch_FileLoading = true;
      })
      .addCase(fetchAzureBranch_File.fulfilled, (state, action) => {
        state.azureBranch_File = action.payload;
        state.isAzureBranch_FileLoading = false;
      })
      .addCase(fetchAzureFileContent.pending, (state) => {
        state.isLoadingFileContent = true;
      })
      .addCase(fetchAzureFileContent.fulfilled, (state, action) => {
        state.azureFileContent = action.payload;
        state.isLoadingFileContent = false;
      })
      .addCase(fetchAzureAllBranchsForCommit.pending, (state, action) => {
        state.isBranchForAzureLoading = true;
      })
      .addCase(fetchAzureAllBranchsForCommit.fulfilled, (state, action) => {
        state.azureAllBranchList = action.payload;
        state.isBranchForAzureLoading = false;
      });

  }
});

export const { setToken_Azure, setOrgNameAzure, setProjectName } = azureDirectorySlice.actions;
export default azureDirectorySlice.reducer;
