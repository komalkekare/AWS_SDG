import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AWS from "aws-sdk";



export const fetchGithubBranches = createAsyncThunk(
  "btaas/githubBranch",
  async (gitSetupCred) => {
    try {
      const apiBodyData = {
        type: "listbranch",
        token: gitSetupCred.gitPat,
        username: gitSetupCred.repoOwner,
        repo: gitSetupCred.selectedRepo
      };
    const { data } = await axios.post(
        `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/Btaas-GIT`, apiBodyData
    );

      return data;
    } catch (err) {
      return err;
    }
  }
);

export const fetchModulesForGithub = createAsyncThunk(
  "btass/modulesForGithub",
  async (gitSetupCred) => {
    try {
      const apiBodyData = {
        type: "listfiles",
        token: gitSetupCred.gitPat,
        username: gitSetupCred.repoOwner,
        repo: gitSetupCred.repoName,
        branch: gitSetupCred.branchName
      };
    const { data } = await axios.post(
        `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/Btaas-GIT`, apiBodyData
    );
      return data;
    } catch (err) {
      return err;
    }
  }
);

export const fetchGithubSubmitHandle = createAsyncThunk(
  "btaas/promptResponse",
  async (prompt) => {
    try {
      const requestBody = {
        prompt: prompt,
        type: "Btaas"
      };
        const response = await axios.post('https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminiFunction',requestBody);
      console.log("RESP", response.data)
      return response.data;
    } catch (err) {}
  }
);
