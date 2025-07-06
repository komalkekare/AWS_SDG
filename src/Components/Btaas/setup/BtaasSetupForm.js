import React, { useState } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gitSetup } from "../../Store/Thunk/Btaas/setup";
import { setGitSetupCred } from "../../Store/Action/Btaas/testDataSlice";
import Loader from "../../Utils/loader";
import BtaasBanner from "../../../assests/btaas_landing.jpg";
import RowRadioButtonsGroup from "../../Utils/RadioButton";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { fetchGitLabGroups, fetchGitlabProjects } from "../../Store/Thunk/Btaas/GitLab/GitLab.thunk";
import {
  setRadioButton,
  setGitLabTokenValue,
  setGroupUserSelected,
} from "../../Store/Action/Btaas/GitLab/GitLab.slice";
import { setToken_Azure, setOrgNameAzure, setProjectName } from "../../Store/Action/Btaas/Azure/Azure.slice";
import { fetchAzureProjects, fetchAzureRepo } from "../../Store/Thunk/Btaas/Azure/Azure.thunks";
// import { setPipelineGitSetupCred } from "../../Store/Action/Pipeline/pipelineSlice";
// import { pipelineGitSetup } from "../../Store/Thunk/Pipeline/pipeline";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function BtaasSetupForm() {
  const value = ["GitHub", "GitLab", "Azure", "Other"];
  const [radioButtonValue, setRadioButtonValue] = useState("GitHub");
  const [gitLabToken, setGitLabToken] = useState('');
  const [azureToken, setAzureToken] = useState('');
  const [azureorg, setAzureOrg] = useState('')
  const [gitlabGroupSelected, setGitlabGroupSelected] = useState('');
  const { isRepoListLoading } = useSelector((state) => state.btaasTestData);
  const { group, isLoadingGroups, isLoadingProjects } = useSelector((state) => state.btaasGitLab);
  const { azureProjects, projectSelected, isAzureProjectLoading } = useSelector((state) => state.azureBtass)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const setupCred = {
      pat: data.get("patToken"),
      repoOwner: data.get("repoOwner"),
    };
    if(radioButtonValue === 'GitHub') {
    dispatch(setGitSetupCred(setupCred));
    dispatch(gitSetup(setupCred));
    }
    else if(radioButtonValue === 'GitLab') {
      dispatch(fetchGitlabProjects({
        token: gitLabToken,
        groupName: gitlabGroupSelected
      }))
    } else if(radioButtonValue === 'Azure'){
      dispatch(fetchAzureRepo({
        token: azureToken,
        orgName: azureorg,
        projectName: projectSelected
      }))
    }
    navigate("/btaas");
  };

  const handleRadioSelect = (e) => {
    setRadioButtonValue(e.currentTarget.value);
    dispatch(setRadioButton(e.currentTarget.value));
  };

  const handleGitToken = (e) => {
    dispatch(
      fetchGitLabGroups({
        token: e.target.value,
      })
    );
    dispatch(setGitLabTokenValue(e.target.value));
  };

  const handleGitLabGroupSelect = (e) => {
    console.log(e.target.value, 'gitlab');
    setGitlabGroupSelected(e.target.value);
    dispatch(setGroupUserSelected(e.target.value));
  }

  const saveTokenToStore = (e) => {
    dispatch(setToken_Azure(e.target.value));
  }

  const saveOrgToStore = (e) => {
    dispatch(setOrgNameAzure(e.target.value));
    dispatch(fetchAzureProjects({
      token: azureToken,
      orgName: e.target.value
    }))
  }

  const handleselectAzureprojects = (e) => {
    dispatch(setProjectName(e.target.value));
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#f1f3f0ab",
          boxShadow: "1px 3px 5px 2px",
          height: "fit-content",
        }}
      >
        <div
          style={{
            width: "100%",
            position: "relative",
            height: "fit-content",
            padding: 20,
          }}
        >
          <img
            style={{
              width: "90%",
              height: "120%",
              position: "relative",
            }}
            src={BtaasBanner}
          />
        </div>
        <div style={{ position: "relative", margin: "0px 20px 0px 20px" }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Btaas Setup
            </Typography>
            <RowRadioButtonsGroup
              value={value}
              selectedValue={radioButtonValue}
              heading="Code Repo"
              change={handleRadioSelect}
            />
            <Box noValidate sx={{ mt: 1,  minWidth: 250 }}>
              {radioButtonValue === "GitHub" && (
                <>
                  <TextField
                    id="patToken"
                    name="patToken"
                    label="PAT Token"
                    size="small"
                    type="password"
                    required
                    fullWidth
                  />
                  <TextField
                    id="repoOwner"
                    label="Repo Owner"
                    name="repoOwner"
                    margin="dense"
                    size="small"
                    required
                    fullWidth
                  />
                </>
              )}
            </Box>
              <Box noValidate>
            {radioButtonValue === "GitLab" && (
              <>
                <TextField
                  required
                  fullWidth
                  size="small"
                  name="GitToken"
                  label="Git Token"
                  id="git-token"
                  onChange={(e) => setGitLabToken(e.target.value)}
                  onBlur={handleGitToken}
                />
                <FormControl sx={{ mt: 2, minWidth: 50 }}>
                  <InputLabel id="demo-simple-select-label">
                    Group List
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size="small"
                    label="Group List"
                    onChange={handleGitLabGroupSelect}
                    fullWidth
                  >
                    {isLoadingGroups && <Loader/>}
                    {group &&
                      group.map((value, i) => (
                        <MenuItem key={`${value}_key`} value={value}>{value}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
                </>
            )}
              </Box>
            {radioButtonValue === "Azure" && (
              <Box noValidate sx={{ mt: 1, minWidth: 250 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  name="AzureToken"
                  label="Azure Token"
                  id="azure-token"
                  
                  onBlur={saveTokenToStore}
                  onChange={(e) => setAzureToken(e.target.value)}
                />
                <TextField
                  required
                  sx={{ mt: 2 }}
                  fullWidth
                  size="small"
                  name="OrgName"
                  label="Org Name"
                  id="azure-token"
                  onChange={(e) => setAzureOrg(e.target.value)}
                  onBlur={saveOrgToStore}
                />
                {azureProjects &&
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="demo-simple-select-label">
                    Projects
                  </InputLabel>
                  <Select
                    id="demo-simple-select_azure"
                    size="small"
                    label="Project List"
                    onChange={handleselectAzureprojects}
                  >
                    {azureProjects && azureProjects.map((proj, index) => (
                        <MenuItem key={index} value={proj} >{proj}</MenuItem>
                      ))}
                  </Select>
                </FormControl>}
              </Box>
            )}
            
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
            {(isRepoListLoading || isLoadingProjects || isAzureProjectLoading) && <Loader />}
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
}
