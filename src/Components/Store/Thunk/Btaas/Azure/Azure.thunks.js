import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const azureApiURL = `https://us-central1-gai-ctooffice.cloudfunctions.net/BTaaS_AzureDevops`;

export const fetchAzureProjects = createAsyncThunk(
  "azureRepo/projects",
  async (azureData) => {
    const apiBodyData = {
      type: "listprojects",
      token: azureData.token,
      org_name: azureData.orgName,
    };

    try {
      const { data } = await axios.post(azureApiURL, apiBodyData);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const fetchAzureRepo = createAsyncThunk(
  "azureRepo/repo",
  async (azureData) => {
    const apiBodyData = {
      type: "listrepos",
      token: azureData.token,
      org_name: azureData.orgName,
      project_name: azureData.projectName
    };

    try {
      const { data } = await axios.post(azureApiURL, apiBodyData);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const fetchAzureBranch_File = createAsyncThunk(
  "azureRepo/branch_file",
  async (azureData) => {
    const apiBodyData = {
      type: "listfiles",
      token: azureData.token,
      org_name: azureData.orgName,
      project_name: azureData.projectName,
      repo_name: azureData.repoName
    };

    try {
      const { data } = await axios.post(azureApiURL, apiBodyData);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const fetchAzureFileContent = createAsyncThunk(
  "azureRepo/fileContents",
  async (azureData) => {
    const apiBodyData = {
      type: "getfilecontent",
      token: azureData.token,
      org_name: azureData.orgName,
      project_name: azureData.projectName,
      repo_name: azureData.repoName,
      file_path: azureData.filePath,
    };
    try {
      const { data } = await axios.post(azureApiURL, apiBodyData);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const fetchAzureAllBranchsForCommit = createAsyncThunk(
  "azureRepo/allBranches",
  async (azureData) => {
    const apiBodyData = {
      type: "listallbranches",
      token: azureData.token,
      org_name: azureData.orgName,
      project_name: azureData.projectName,
      repo_name: azureData.repoName,
    };
    try {
      const { data } = await axios.post(azureApiURL, apiBodyData);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
