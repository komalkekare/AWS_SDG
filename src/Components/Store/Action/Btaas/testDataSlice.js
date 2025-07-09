import { createSlice } from "@reduxjs/toolkit";
import { gitSetup } from "../../Thunk/Btaas/setup";
// import {
//   getTableSchema,
//   getTables,
//   generateData,
//   getBranches,
//   backToDb,
//   pushInGithub,
// } from "../../Thunk/Btaas/testData";

const initialState = {
  gitSetupCred: null,
  repoList: null,
  isRepoListLoading: null,
  dbType: null,
  selectedTable: null,
  dataStoreCred: null,
  genericDbCred: null,
  tableList: null,
  tableSchema: null,
  isTableListLoading: null,
  isTableSchemaLoading: null,
  syntheticData: null,
  isSyntheticDataLoading: null,
  destination: null,
  destRepo: null,
  branchList: null,
  destBranch: null,
  backToDbResp: null,
  isBacktoDbLoading: null,
  isPushInGithubLoading: null,
  pushInGithubResp: null,
  fileType: "JSON",
  fileName: null,
};

const testDataSlice = createSlice({
  name: "testDataSlice",
  initialState,
  reducers: {
    setGitSetupCred(state, action) {
      state.gitSetupCred = action.payload;
    },
    setDbType(state, action) {
      state.dbType = action.payload;
    },
    setSelectedTable(state, action) {
      state.selectedTable = action.payload;
    },
    setDataStoreCred(state, action) {
      state.dataStoreCred = action.payload;
    },
    setGenericDbCred(state, action) {
      state.genericDbCred = action.payload;
    },
    setDestination(state, action) {
      state.destination = action.payload;
    },
    setDestRepo(state, action) {
      state.destRepo = action.payload;
    },
    setDestBranch(state, action) {
      state.destBranch = action.payload;
    },
    setFileType(state, action) {
      state.fileType = action.payload;
    },
    setFileName(state, action) {
      state.fileName = action.payload;
    },
    // clearBackToDbResp(state) {
    //   state.backToDbResp = null;
    // },
    clearPushInGithub(state) {
      state.pushInGithubResp = null;
    },
    clearTableList(state) {
      state.tableList = null;
      state.selectedTable = null;
      state.tableSchema = null;
      state.destination = null;
      state.destRepo = null;
      state.fileName = null;
      state.syntheticData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(gitSetup.fulfilled, (state, action) => {
      state.repoList = action.payload;
      state.isRepoListLoading = false;
    });
    builder.addCase(gitSetup.pending, (state) => {
      state.isRepoListLoading = true;
    });
    // builder.addCase(getTables.fulfilled, (state, action) => {
    //   state.tableList = action.payload;
    //   state.isTableListLoading = false;
    // });
    // builder.addCase(getTables.pending, (state) => {
    //   state.isTableListLoading = true;
    // });
    // builder.addCase(getTableSchema.fulfilled, (state, action) => {
    //   state.tableSchema = action.payload;
    //   state.isTableSchemaLoading = false;
    // });
    // builder.addCase(getTableSchema.pending, (state) => {
    //   state.isTableSchemaLoading = true;
    // });
    // builder.addCase(generateData.fulfilled, (state, action) => {
    //   state.syntheticData = action.payload;
    //   state.isSyntheticDataLoading = false;
    // });
    // builder.addCase(generateData.pending, (state) => {
    //   state.isSyntheticDataLoading = true;
    // });
    // builder.addCase(getBranches.fulfilled, (state, action) => {
    //   state.branchList = action.payload;
    // });
    // builder.addCase(.fulfilled, (state, action) => {
    //   state.backToDbResp = action.payload;
    //   state.isBacktoDbLoading = false;
    // });
    // builder.addCase(pushInGithub.fulfilled, (state, action) => {
    //   state.pushInGithubResp = action.payload;
    //   state.isPushInGithubLoading = false;
    // });
    // builder.addCase(backToDb.pending, (state) => {
    //   state.isBacktoDbLoading = true;
    // });
    // builder.addCase(pushInGithub.pending, (state) => {
    //   state.isPushInGithubLoading = true;
    // });
  },
});

export const {
  setFileName,
  setFileType,
  clearBackToDbResp,
  clearPushInGithub,
  setDestBranch,
  setDestRepo,
  clearTableList,
  setDestination,
  setGenericDbCred,
  setDataStoreCred,
  setGitSetupCred,
  setDbType,
  setSelectedTable,
} = testDataSlice.actions;
export default testDataSlice.reducer;