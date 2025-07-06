import { createSlice } from "@reduxjs/toolkit";
import { fetchGitLabBranches, fetchGitLabFileContent, fetchGitLabFileName, fetchGitLabFolders, fetchGitLabGroups, fetchGitlabProjects } from "../../../Thunk/Btaas/GitLab/GitLab.thunk";

const initialState = {
    repoToBeUsed: 'GitHub',
    token: '',
    group: null,
    groupUserSelected: '',
    projects: null,
    branches: '',
    folders: '',
    fileName: '',
    fileContent: '',
    isLoadingGroups: false,
    isLoadingProjects: false,
    isLoadingBranches: false,
    isLoadingFolders: false,
    isLoadingFile: false,
    isLoadingContent: false
}

const gitlabData = createSlice({
    name: 'btaasGitLabData',
    initialState,
    reducers: {
        setRadioButton(state, action){
            state.repoToBeUsed = action.payload;
        },
        setGitLabTokenValue(state, action){
            state.token = action.payload;
        },
        setGroupUserSelected(state, action){
            state.groupUserSelected = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchGitLabGroups.pending, (state) => {
            state.isLoadingGroups = true;
          })
          .addCase(fetchGitLabGroups.fulfilled, (state, action) => {
            state.group = action.payload;
            state.isLoadingGroups = false;
          })
          .addCase(fetchGitlabProjects.pending, (state) => {
            state.isLoadingProjects = true;
          })
          .addCase(fetchGitlabProjects.fulfilled, (state, action) => {
            state.projects = action.payload;
            state.isLoadingProjects = false;
          })
          .addCase(fetchGitLabBranches.pending, (state) => {
            state.isLoadingBranches = true;
          })
          .addCase(fetchGitLabBranches.fulfilled, (state, action) => {
            state.branches = action.payload;
            state.isLoadingBranches = false;
          })
          .addCase(fetchGitLabFolders.pending, (state) => {
            state.isLoadingFolders = true;
          })
          .addCase(fetchGitLabFolders.fulfilled, (state, action) => {
            state.folders = action.payload;
            state.isLoadingFolders = false;
          })
          .addCase(fetchGitLabFileName.pending, (state) => {
            state.isLoadingFile = true;
          })
          .addCase(fetchGitLabFileName.fulfilled, (state, action) => {
            state.fileName = action.payload;
            state.isLoadingFile = false;
          })
          .addCase(fetchGitLabFileContent.pending, (state) => {
            state.isLoadingContent = true;
          })
          .addCase(fetchGitLabFileContent.fulfilled, (state, action) => {
            state.fileContent = action.payload;
            state.isLoadingContent = false;
          })
    }
});

export const { setRadioButton, setGitLabTokenValue, setGroupUserSelected } = gitlabData.actions;
export default gitlabData.reducer;
