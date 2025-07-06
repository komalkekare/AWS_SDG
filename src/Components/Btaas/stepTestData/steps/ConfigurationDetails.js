/**
 * @file ConfigurationDetails.js
 * This file contains the implementation for handling database requests and displaying connection details.
 * It supports multiple database types including Firestore, BigQuery, Cloud SQL and JSON/CSV. 
 * The flow follows as:
 * 1. Handles user selection of a database type (BigQuery, Firestore, Cloud SQL, JSON/CSv).
 * 2. Sends HTTP requests to fetch datasets, tables, or connection details based on the selected database type.
 * 3. Displays the corresponding details to the user (e.g., connection details, tables) within a form.
 * 4. Handles the loading state and displays feedback to the user.
 * 
 * Functionality Overview:
 * - The user selects a source system (database type) from a dropdown (`Source Systems`).
 * - Depending on the selected database type:
 *   - **Firestore**: Fetches data from Firestore and get tables, generated data and push the data back to firestore accordingly .
 *   - **BigQuery**: Fetches dataset and tables information from the BigQuery API.
 *   - **Cloud SQL**: Handles Cloud SQL integration by sending a request to the Cloud Function to fetch table details.
 *   - **JSON/CSV**: Uploads the file with extensions .json or .csv and fetches the schema and table data from the API response.
 * - The form for Cloud SQL allows users to input connection details such as Project ID, Location, Instance Name, Username, Password, and other necessary credentials.
 * - Displays a button (`Get Tables`) to fetch tables once the Cloud SQL connection details are provided.
 * - Displays the status of the process (e.g., "Processing..." while loading data).
 * 
 * Assumptions:
 * - The `projectId`, `dbType`, and other necessary data are passed as inputs to make requests.
 * - It uses sessionStorage for managing some state such as `dataset_id`.
 * - The API requests are made to Google Cloud Functions and the response data is logged or used within the application.
 * 
 * Expected Components:
 * - **Form**: Displays form fields for Cloud SQL connection.
 * - **API Requests**: Based on the selected `dbType`, relevant API endpoints are invoked.
 * - **State Management**: Updates the component state with the fetched tables or datasets.
 * - **User Feedback**: The UI provides feedback about the loading state of data fetching.
 * 
 * Dependencies:
 * - React components: FormControl, Select, MenuItem, Box, Button, Typography, TextField, etc.
 * - Fetch API for making HTTP requests.
 * 
 */
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { getTables } from "../../../Store/Thunk/Btaas/testData";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, CircularProgress } from "@mui/material";
import { Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import { List, ListItem } from '@mui/material';
import {
  clearTableList,
  setDbType,
  // setDataStoreCred,
  setGenericDbCred,
} from "../../../Store/Action/Btaas/testDataSlice";
import Loader from "../../../Utils/loader";

export default function GetTables() {
  const { dbType, dataStoreCred, isTableListLoading } = useSelector(
    (state) => state.btaasTestData
  );
  
  const [InputValue,setInputValue] = useState("");
  const [selectedDbType, setSelectedDbType] = useState("CloudSql"); // Set default DB type to CloudSql
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  // const [numRows, setNumRows] = useState('');
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]); // State to hold tables data
  // const [datasets, setDatasets] = useState([]); // State to hold fetched datasets
  const dispatch = useDispatch();
  const [selectedTable, setSelectedTable] = useState('');
  // const [datasetId, setDatasetId] = useState(''); // State for Dataset ID
  const [storedProjectId , setstoredProjectId ] = useState("");
  const handleChange = (e) => {setInputValue(e.target.value); sessionStorage.setItem("project_id",(e.target.value))};
  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };
  // By default displayed CloudSql data sources
  useEffect(() => {
    setSelectedDbType("CloudSql");
    dispatch(setDbType("CloudSql"));

  }, [dispatch]);

  useEffect(() => {
    sessionStorage.clear();
    setstoredProjectId(sessionStorage.getItem('project_id'));
    if (storedProjectId) {
      console.log('Stored Project ID:', storedProjectId);
    } else {

      // sessionStorage.setItem('project_id', "brlcto-btaasgcp");
      // sessionStorage.setItem('dataset_id', "btaastest");
      sessionStorage.setItem('dbType',"CloudSql");
      

    }
  }, []);
  // const projectId = sessionStorage.getItem('project_id');
  // const datasetId = sessionStorage.getItem('dataset_id');
  const handleSelectDb = (event) => {
    const newDbType = event.target.value;
    setSelectedDbType(newDbType); // Update local state
    dispatch(setDbType(newDbType));  // Update global state
    sessionStorage.setItem('dbType', newDbType);
  };

  const handleGenericDbCred = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const genericDbCred = {
      db: dbType,
      connectionName: data.get("connectionname"),
      dbName: data.get("dbName"),
      username: data.get("username"),
      password: data.get("password"),
    };
    dispatch(setGenericDbCred(genericDbCred));
    dispatch(clearTableList());
    dispatch(getTables(genericDbCred));
  };

  const handleDataStoreDbCred = async (event) => {
    // event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // const keyFile = data.get("keyFile");
    // const keyFileJson = JSON.parse(keyFile);
    // console.log(keyFileJson);
    // const dataStoreCred = {
    //   db: dbType,
    //   keyFile: keyFileJson,
    // };
    // dispatch(setDataStoreCred(dataStoreCred));
    // dispatch(clearTableList());
    dispatch(getTables(dataStoreCred));
  };
  // JSON/CSV function for file uploading by API call to extract schema and sensitive fields
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setUploading(true);
      setUploaded(false);

      const formData = new FormData();
      formData.append("file", uploadedFile);
      const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
      const dbType = fileExtension === "json" ? "JSON" : fileExtension === "csv" ? "CSV" : null;
  
      if (dbType) {
        
        sessionStorage.setItem("dbType", dbType);
      }

      try {
        const response = await fetch(
          "https://us-central1-brlcto-btaasgcp.cloudfunctions.net/testmasking/upload-file?project_id=brlcto-btaasgcp",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("API Response:", result);
          
          const sortedColumns = result.schema
          .filter(column => column.type !== "nested" && column.type !== "list")
          // .sort((a, b) => a.name.localeCompare(b.name));

          console.log("Sorted Columns:", sortedColumns);
          
          sessionStorage.setItem("Primary Schema", JSON.stringify(sortedColumns));
          sessionStorage.setItem("Nested Schema", JSON.stringify(sortedColumns))
          sessionStorage.setItem("fileType", result.file_type);
          // sessionStorage.setItem("Primary Sensitive Fields",JSON.stringify(data.sensitive_fields.map((field) => field.field_name)))
          sessionStorage.setItem("Sensitive Fields", JSON.stringify(result.sensitive_fields.map((field) => field.field_name)))
          setUploading(false);
          setUploaded(true);
        } else {
          console.error("Failed to upload file");
          setUploading(false);
        }
      } catch (error) {
        console.error("Error during file upload:", error);
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the authentication endpoint to get the token
      // const authResponse = await fetch(
      //     'https://us-central1-telehealth-365911.cloudfunctions.net/dashboarddata/auth',
      //     {
      //         method: 'POST',
      //         headers: {
      //             'Content-Type': 'application/json',
      //             'Accept': 'application/json'
      //         },
      //         body: JSON.stringify({
      //             endpoint: 'https://us-central1-telehealth-365911.cloudfunctions.net/function-4',
      //         }),
      //     }
      // );

      // const authData = await authResponse.json();
      // const token = authData.token; // Assuming the token is in authData.token
      // console.log(authData.token);

      // if (!token) throw new Error('Failed to obtain token');
      const projectId = sessionStorage.getItem('project_id');
      let functionResponse;

      const dbType = sessionStorage.getItem('dbType');
      console.log('Selected dbType:', dbType);
      if (dbType === "Firestore") {
        // Fetch the project_id from session storage
        // const projectId = sessionStorage.getItem('project_id');

        // Use the Firestore URL and JSON body
        const firestoreBody = JSON.stringify({
          project_id: projectId // Use the stored project_id
        });

        functionResponse = await fetch(
          `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/firestore-collections?project_id=${projectId}`,
          {
            method: 'POST',
            headers: {
              // Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json' // Set content type to JSON
            },
            body: firestoreBody,
          }
        );


        if (!functionResponse.ok) {
          const errorMessage = await functionResponse.text(); // Get response as text
          console.error(`Function request failed with status ${functionResponse.status}: ${errorMessage}`);
          throw new Error('Function request failed');
        }

        const responseJson = await functionResponse.json();
        console.log('Firestore response:', responseJson);

      } else if (dbType === "BigQuery") {
        // Handle BigQuery request
        console.log('Entered BigQuery block');
        // Fetch the dataset using the project ID
        functionResponse = await fetch(
          `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/datasets?project_id=${projectId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json' // Set content type to JSON
            },
          }
        );

        if (!functionResponse.ok) {
          const errorMessage = await functionResponse.text(); // Get response as text
          console.error(`Dataset request failed with status ${functionResponse.status}: ${errorMessage}`);
          throw new Error('Dataset request failed');
        }

        const datasetsJson = await functionResponse.json();
        console.log('Datasets response:', datasetsJson);

        // Assuming datasetsJson contains an array of datasets and you want to fetch tables for the first one
        // const datasetId = datasetsJson.datasets[0];
        const datasetId = sessionStorage.getItem('dataset_id') || datasetsJson.datasets[0];
        console.log('Fetched dataset ID:', datasetId);

        if (datasetId) {
          // Fetch the tables in the dataset using the dataset ID
          functionResponse = await fetch(
            `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/tables?project_id=${projectId}&dataset_id=${datasetId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json' // Set content type to JSON
              },
            }
          );

          if (!functionResponse.ok) {
            const errorMessage = await functionResponse.text();
            console.error(`Tables request failed with status ${functionResponse.status}: ${errorMessage}`);
            throw new Error('Tables request failed');
          }

          const tablesJson = await functionResponse.json();
          console.log('Tables response:', tablesJson);
          setTables(tablesJson.tables);
          dispatch(getTables(tablesJson));
        } else {
          // console.error('No datasets found for the project.');
        }
      } else if (dbType === "CloudSql") {
        console.log('Entered Cloud SQL block');
        sessionStorage.removeItem('dataset_id');
        // Cloud SQL integration
        const cloudSqlBody = JSON.stringify({
          project_id: 'brlcto-btaasgcp',
          location: 'us-central1',
          instance_name: 'sdg',
          db_user:  process.env.REACT_APP_DB_USER,
          db_pass:  process.env.REACT_APP_DB_PASS,
          db_name: process.env.REACT_APP_DB_NAME
        });

        // Store Cloud SQL body in session storage
        sessionStorage.setItem('projectid', cloudSqlBody.project_id);

        functionResponse = await fetch(
          `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/cloud-sql-tables?project_id=${'brlcto-btaasgcp'}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: cloudSqlBody,
          }
        );

        if (!functionResponse.ok) {
          const errorMessage = await functionResponse.text();
          console.error(`Cloud SQL request failed with status ${functionResponse.status}: ${errorMessage}`);
          throw new Error('Cloud SQL request failed');
        }

        const cloudSqlJson = await functionResponse.json();
        console.log('Cloud SQL response:', cloudSqlJson);
        // Handle the response as needed (e.g., update state or dispatch actions)
        if (cloudSqlJson.tables) {
          setTables(cloudSqlJson.tables); // Update state with table names
        }
      } else {
        // console.error('Invalid dbType');
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minWidth: 140 }}>
      <div className="row">
        <div className="col-md-3">
          <FormControl sx={{ m: 1, minWidth: 140, paddingRight: 2 }}>
            <InputLabel id="demo-simple-select-label" sx={{
              backgroundColor: 'white', // Ensures label background does not get cut by outline
              padding: '0 4px', // Adds slight padding around label
              transform: 'translate(-px, -5px) scale(1)', // Adjust position slightly upward
            }}>Source Systems</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedDbType}
              label="DB Type"
              onChange={handleSelectDb}
            >
              <MenuItem value="BigQuery">BigQuery</MenuItem>
              <MenuItem value="CloudSql">CloudSql</MenuItem>
              {/* <MenuItem value="AlloyDb">AlloyDb</MenuItem> */}
              <MenuItem value="Firestore">Firestore</MenuItem>
              {/* <MenuItem value="Excel">Excel</MenuItem> */}
              <MenuItem value="JSON/CSV">JSON/CSV</MenuItem>
              {/* <MenuItem value="CSV">CSV</MenuItem> */}
            </Select>
          </FormControl>
        </div>
        <div className="col-md-6">
        {selectedDbType === 'CloudSql' && (
  <Card sx={{ maxWidth: 650, margin: "auto", boxShadow: 3 }}>
    <CardContent>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          "& .MuiTextField-root": { m: 1 },
          gap: 2, 
        }}
      >
        <div>
          <Typography variant="h5" component="h5">
            {dbType} Connection Details
          </Typography>
        </div>
        <div>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            required
            // helperText="Project ID"
            id="project_id"
            name="project_id"
            label="Project ID"
            variant="outlined"
            onChange={handleChange}
          />
          <TextField
            required
            // helperText="Location"
            id="location"
            name="location"
            label="Location"
            variant="outlined"
          />
          <TextField
            required
            // helperText="Instance Name"
            id="connectionname"
            name="connectionname"
            label="Instance Name"
            variant="outlined"
          />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            required
            // helperText="User"
            id="user"
            name="user"
            label="Instance User"
            variant="outlined"
          />
          <TextField
            required
            // helperText="Password"
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
          />
          <TextField
            required
            // helperText="Username"
            id="username"
            name="username"
            label="Username"
            variant="outlined"
          />
          </Box>
        </div>
        <div>
          <Button size="small" type="submit" variant="contained" disabled={loading}>
            {loading ? 'Processing...' : 'Get Tables'}
          </Button>
        </div>
      </Box>
    </CardContent>
  </Card>
)}
          {tables.lengths > 0 && selectedDbType === 'CloudSql' && (
            <TableContainer component={Paper} sx={{ marginTop: 2, maxWidth: 300, marginX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Table Names
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tables.map((table, index) => (
                    <TableRow key={index} sx={{ backgroundColor: selectedTable === table ? '#f0f0f0' : 'transparent' }}>
                      <TableCell>{table.toUpperCase()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

{(dbType === "Firestore") && (
  <Card sx={{ maxWidth: 400, margin: "auto", boxShadow: 3 }}>
    <CardContent>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <Typography variant="h5" component="h5">
            {dbType} Connection Details
          </Typography>
        </div>
        <div style={{ paddingTop: "10px" }}>
          <TextField
            required
            // helperText="Project id"
            name="keyFile"
            id="keyFile"
            label="Project ID"
            variant="outlined"
            type="text"
            value={InputValue} // Adjust this based on your state management
            onChange={handleChange}
          />
        </div>
        {isTableListLoading && <Loader />}
        <div>
          {/* <Button type="submit" variant="contained">
            Get Tables
          </Button> */}
        </div>
      </Box>
    </CardContent>
  </Card>
)}
          {(dbType === "BigQuery") && (
             <Card sx={{ maxWidth: 650, margin: "auto", boxShadow: 3 }}>
             <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                "& .MuiTextField-root": { m: 1 },
              }}
            >
              <div>
                <Typography variant="h5" component="h5">
                  {dbType} Connection Details
                </Typography>
              </div>
              <Box sx={{ display: 'flex', gap: 2, paddingTop: "10px" }}>
                <TextField
                  required
                  // helperText="Project ID"
                  name="projectID"
                  id="projectID"
                  label="Project ID"
                  variant="outlined"
                  type="text"
                  value={InputValue}
                  onChange={handleChange}

                  sx={{ width: '100%' }} 
                />
                <TextField
                  required
                  // helperText="Dataset ID"
                  name="datasetID"
                  id="datasetID"
                  label="Dataset ID"
                  variant="outlined"
                  type="text"
                  value={dataStoreCred?.datasetID} 
                  sx={{ width: '100%' }} 
                />
                
              </Box>
              <div>
              <div>
          <Button size="small" type="submit" variant="contained" disabled={loading}>
            {loading ? 'Processing...' : 'Get Tables'}
          </Button>
        </div>
              </div>
              </Box>
            </CardContent>
            </Card>
          )}
           {tables.length > 0 &&  (
                <TableContainer component={Paper} sx={{ marginTop: 2, maxWidth: 300, marginX: 'auto' }}>
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Table Names
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tables.map((table, index) => (
                        <TableRow
                          key={index}
                          onClick={() => handleTableSelect(table)} 
                          // hover
                          sx={{
                            // cursor: 'pointer',
                            backgroundColor: selectedTable === table ? '#f0f0f0' : 'transparent',
                          }}
                        >
                          <TableCell>{table.toUpperCase()}</TableCell>
                         
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {/* {(dbType === "CloudSQL") && (
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    "& .MuiTextField-root": { m: 1 },
                  }}
                >
                  <div>
                    <Typography variant="h5" component="h5">
                      {dbType} Connection Details
                    </Typography>
                  </div>

                  
                  <Box sx={{ display: 'flex', gap: 2, paddingTop: "10px" }}>
                    <TextField
                      required
                      helperText="Project ID"
                      name="project_id"
                      id="project_id"
                      label="Project ID"
                      variant="outlined"
                      type="text"
                      value={dataStoreCred?.project_id} // Adjust this based on your state management
                      sx={{ width: '100%' }}
                    />
                    <TextField
                      required
                      helperText="Location"
                      name="location"
                      id="location"
                      label="Location"
                      variant="outlined"
                      type="text"
                      value={dataStoreCred?.location} // Adjust this based on your state management
                      sx={{ width: '100%' }}
                    />
                  </Box>

                  
                  <Box sx={{ display: 'flex', gap: 2, paddingTop: "10px" }}>
                    <TextField
                      required
                      helperText="Instance Name"
                      name="instanceName"
                      id="instanceName"
                      label="Instance Name"
                      variant="outlined"
                      type="text"
                      value={dataStoreCred?.instanceName} // Adjust this based on your state management
                      sx={{ width: '100%' }}
                    />
                    <TextField
                      required
                      helperText="User"
                      name="user"
                      id="user"
                      label="User"
                      variant="outlined"
                      type="text"
                      value={dataStoreCred?.user} // Adjust this based on your state management
                      sx={{ width: '100%' }}
                    />
                  </Box>

                  
                  <Box sx={{ display: 'flex', gap: 2, paddingTop: "10px" }}>
                    <TextField
                      required
                      helperText="Password"
                      name="password"
                      id="password"
                      label="Password"
                      variant="outlined"
                      type="password"
                      value={dataStoreCred?.password} // Adjust this based on your state management
                      sx={{ width: '100%' }}
                    />
                    <TextField
                      required
                      helperText="Username"
                      name="username"
                      id="username"
                      label="Username"
                      variant="outlined"
                      type="text"
                      value={dataStoreCred?.username} // Adjust this based on your state management
                      sx={{ width: '100%' }}
                    />
                  </Box> */}


                  {/* {isTableListLoading && <Loader />}
                  <div> */}
                    {/* Uncomment if you want a "Get Tables" button */}
                    {/* <Button type="submit" variant="contained">
        Get Tables
      </Button> */}
                  {/* </div>
                </Box>
              )} */}



              {/* {isTableListLoading && <Loader />} */}
              {/* <div>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Processing...' : 'Get Tables'}
                </Button>
              </div> */}
              {/* {tables.length > 0 && (
                <TableContainer component={Paper} sx={{ marginTop: 2, maxWidth: 300, marginX: 'auto' }}>
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Table Name
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tables.map((table, index) => (
                        <TableRow
                          key={index}
                          onClick={() => handleTableSelect(table)} 
                          hover
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: selectedTable === table ? '#f0f0f0' : 'transparent',
                          }}
                        >
                          <TableCell>{table.toUpperCase()}</TableCell>
                         
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {selectedTable && ( 
            <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
              You have selected the {selectedTable} dataset. Please click on NEXT to generate the schema.
            </Typography>
          )} */}
           
          {(dbType === "JSON/CSV" ) && (
            <Card sx={{ maxWidth: 400, margin: "auto", boxShadow: 3 }}>
            <CardContent>        
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                "& .MuiTextField-root": { m: 1 },
              }}
            >
              <div>
                <Typography variant="h5" component="h5">
                  Upload File Here
                </Typography>
              </div>
              <div>
                <TextField
                  required
                  // helperText="Upload Files"
                  id="uploadFiles"
                  name="uploadFiles"
                  variant="outlined"
                  type="file"
                  inputProps={{
                    accept: ".json, .csv, .xlsx",
                  }}
                  onChange={handleFileUpload}
                />
              </div>
              {uploading && (
            <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
              <CircularProgress size={24} sx={{ marginRight: 1 }} />
              <Typography variant="body2">Please wait till the file is being uploaded</Typography>
            </Box>
          )}

          {/* Uploaded State */}
          {uploaded && (
            <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
              <CheckCircleIcon color="success" sx={{ marginRight: 1 }} />
              <Typography variant="h7">File has been uploaded successfully</Typography>
            </Box>
          )}
            </Box>
            </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Box>
  );
}



