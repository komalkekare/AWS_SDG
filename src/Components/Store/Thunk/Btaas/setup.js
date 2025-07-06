import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const gitSetup = createAsyncThunk("btaas/repoSetup", async(creds,{_, rejectWithValue}) => {
    try {
        const apiBodyData = {
            type: "listrepos",
            token: creds.pat,
            username: creds.repoOwner,
          };
        const { data } = await axios.post(
            `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/Btaas-GIT`, apiBodyData
        );
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})