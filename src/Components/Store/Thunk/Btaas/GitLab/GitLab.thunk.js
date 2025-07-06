import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const apiUrl = `https://us-central1-gai-ctooffice.cloudfunctions.net/BTaaS_Gitlab`;

export const fetchGitLabGroups = createAsyncThunk(
  "btaas/GitLabGroups",
  async (gitlabCred) => {
    
    try {
      const body = {
        type: "listgroups",
        token: gitlabCred.token,
      };
      const { data } = await axios.post(apiUrl, body);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const fetchGitlabProjects = createAsyncThunk(
  "btass/GitLabProjects",
  async (gitlabCred) => {
    const projectContent = {
      type: "listprojects",
      token: gitlabCred.token,
      group_name: gitlabCred.groupName,
      url: "https://gitlab.com",
    };
    try {
      const { data } = await axios.post(apiUrl, projectContent);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const fetchGitLabBranches = createAsyncThunk(
  "btaas/GitLabBranch",
  async (gitlabCred) => {
    const branchContent = {
      type: "listbranches",
      token: gitlabCred.token,
      project_name: gitlabCred.project_name,
      url: "https://gitlab.com",
    };
    try {
      const { data } = await axios.post(apiUrl, branchContent);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const fetchGitLabFolders = createAsyncThunk(
  "btaas/GitLabFolders",
  async (gitLab) => {
     const bodyData = {
       type: "listfolders",
       token: gitLab.token,
       group_name: gitLab.group_name,
       branch: gitLab.branch,
       project_name: gitLab.project_name,
       url: "https://gitlab.com",
     };
     try {
       const { data } = await axios.post(apiUrl, bodyData);

       return data;
     } catch (error) {
       throw new Error(error);
     }
  }
);

export const fetchGitLabFileName = createAsyncThunk(
  "btaas/GitLabFileName",
  async (gitLab) => {
    const bodyContent = {
      type: "listfiles",
      token: gitLab.token,
      group_name: gitLab.group_name,
      branch: gitLab.branch,
      project_name: gitLab.project_name,
      filepath: gitLab.filePath,
      url: "https://gitlab.com",
    };

     try {
       const { data } = await axios.post(apiUrl, bodyContent);

       return data;
     } catch (error) {
       throw new Error(error);
     }
  }
);

export const fetchGitLabFileContent = createAsyncThunk(
  "btaas/GitLabFileContent",
  async (gitLab) => {
    const bodyContent = {
      type: "getfilecontent",
      token: gitLab.token,
      group_name: gitLab.group_name,
      branch: gitLab.branch,
      project_name: gitLab.project_name,
      filepath: gitLab.filepath,
      url: "https://gitlab.com",
    };

     try {
       const { data } = await axios.post(apiUrl, bodyContent);

       return data;
     } catch (error) {
       throw new Error(error);
     }
  }
);
