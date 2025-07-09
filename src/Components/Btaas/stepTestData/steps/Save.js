/**
 * @file Save.js
 * This file contains the Save component which manages the logic related to saving synthetic data to various databases like Firestore, BigQuery, CloudSQL, and Json/Csv. 
   It handles data fetching, table management, and displays loading states and success/error messages.
 * 
 * The component is used to:
 * - Handle the fetching and displaying of synthetic data from session storage.
 * - Display the data in a table with pagination support.
 * - Push synthetic data to multiple data stores based on user selections.
 * - Download synthetic data in different file formats (JSON/CSV).
 * - Manage the display of success alerts upon successful actions like saving or downloading data.
 * 
 * @dependencies 
 * - React Hooks (useState, useEffect, useDispatch, useSelector)
 * - Material-UI components (Table, CircularProgress, etc.)
 * - Custom Loader component
 * 
 * @state
 * - `tableData`: Holds the data to be displayed in a table.
 * - `tableData1`: Holds additional data for other use cases.
 * - `loadingData`: Tracks if data is being fetched or processed.
 * - `expanded`: Keeps track of the expanded rows in the table.
 * - `page`, `rowsPerPage`: Manage pagination state for the table.
 * - `selectedTableName`: Holds the selected table name from session storage.
 * - `selectedPrimaryTable`, `selectedReferenceTable`: Holds the selected primary and reference tables.
 * - `showSuccessAlert`: Determines if the success alert should be displayed.
 * - `alertMessage`: Holds the message to be shown in the success alert.
 * 
 * @functions:
 * - `handleChangePage`: Updates the current page for pagination.
 * - `handleChangeRowsPerPage`: Updates the number of rows per page for pagination.
 * - `handleViewData`: Fetches data from session storage and updates the state based on the selected DB type (Firestore, BigQuery, JSON/CSV, CloudSQL).
 * - `pushDataToFirestore`: Pushes the synthetic data to Firestore.
 * - `pushDataToBigQuery`: Pushes the synthetic data to BigQuery.
 * - `pushDataToCloudSql`: Pushes the synthetic data to CloudSQL.
 * - `downloadSyntheticData`: Downloads synthetic data as a file (JSON/CSV).
 * - `saveSyntheticData`: Initiates the save action for synthetic data based on the selected database type (GitHub, Firestore, BigQuery, etc.).
 * 
 * @externalAPIs
 * - Cloud Functions for Firestore, BigQuery, CloudSQL, and GitHub operations.
 * 
 * Features:
 * This component is primarily used for managing and saving synthetic data related to database operations and
 * interacting with external systems like Firestore, BigQuery, CloudSQL, and GitHub to perform actions like:
 * - Fetching and displaying synthetic data.
 * - Pushing data to external databases.
 * - Downloading synthetic data in a user-friendly format.
 */
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
// import {
//   setDestination,
//   setFileName,
//   setFileType,
//   setDestBranch,
//   setDestRepo,
//   clearBackToDbResp,
// } from "../../../Store/Action/Btaas/testDataSlice";
import {
  Alert,
  FormControlLabel,
  // FormLabel,
  // Radio,
  // RadioGroup,
  Typography,
  // Collapse,
  IconButton,
  Paper,
  TablePagination,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
// import {
//   backToDb,
//   pushInGithub,
//   getBranches,
// } from "../../../Store/Thunk/Btaas/testData";
// import Snackbar from "@mui/material/Snackbar";
import Loader from "../../../Utils/loader";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
export default function Save() {
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // To hold dynamic success message
  const [tableData, setTableData] = useState([]); // New state to hold table data
  const [tableData1, setTableData1] = useState([]); // New state to hold table data
  const [loadingData, setLoadingData] = useState(false); // State to track loading
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedTableName, setSelectedTableName] = useState("");
  const [selectedPrimaryTable, setSelectedPrimaryTable] = useState(null);
  const [selectedReferenceTable, setSelectedReferenceTable] = useState(null);

  const {
    fileType,
    gitSetupCred,
    fileName,
    syntheticData,
    // branchList,
    destBranch,
    destRepo,
    // repoList,
    destination,
    dbType,
    selectedTable,
    dataStoreCred,
    genericDbCred,
    // backToDbResp,
    isBacktoDbLoading,
    isPushInGithubLoading,
    // pushInGithubResp,
  } = useSelector((state) => state.btaasTestData);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    // expandAll();
    setSelectedPrimaryTable(sessionStorage.getItem(selectedPrimaryTable));
    setSelectedReferenceTable(sessionStorage.getItem(selectedReferenceTable));
  }, [tableData]);

  // const initializeExpandedState = (data) => {
  //   const newExpandedState = {};
  //   data.forEach((row, rowIndex) => {
  //     Object.keys(row).forEach((field) => {
  //       if (typeof row[field] === 'object' && row[field] !== null) {
  //         newExpandedState[`${rowIndex}-${field}`] = true; // Set to true to expand by default
  //       }
  //     });
  //   });
  //   setExpanded(newExpandedState);
  // };

  // const handleDestinationChange = (event) => {
  //   dispatch(setDestination(event.target.value));
  // };

  // const handleFileName = (value) => {
  //   dispatch(setFileName(value));
  // };

  // const handleClose = () => {
  //   dispatch(clearBackToDbResp());
  //   setShowSuccessAlert(false);
  // };

  // const handleFileType = (event) => {
  //   dispatch(setFileType(event.target.value));
  // };

  // const handleSelectRepo = (event) => {
  //   dispatch(setDestRepo(event.target.value));
  //   const branchParams = {
  //     gitpat: gitSetupCred.pat,
  //     repoOwner: gitSetupCred.repoOwner,
  //     selectedRepo: event.target.value,
  //   };
  //   dispatch(getBranches(branchParams));
  // };

  // const handleSelectBranch = (event) => {
  //   dispatch(setDestBranch(event.target.value));
  // };

  const handleViewData = async () => {
    setLoadingData(true);
    console.log("handleViewData called");

    const selectedTable = sessionStorage.getItem("selectedTable");
    setSelectedTableName(selectedTable);
    const reorderData = (data, schema) => {
      // Flatten the schema to get the column names in order
      const columnOrder = schema.map(item => item.name);
  
      return data.map((row, rowIndex) => {
        const reorderedRow = {};
        columnOrder.forEach((columnName) => {
          let value = row[columnName];
          if (value && typeof value === "object") {
            value = JSON.stringify(value);
          }
          console.log(`Row ${rowIndex} - Column: ${columnName}, Value: ${value}`);
          reorderedRow[columnName] = value !== undefined ? value : ""; // Default to empty string if undefined
        });
        return reorderedRow;
      });
    };
    if (dbType === "Firestore" || dbType === "BigQuery" || dbType ==="JSON/CSV") {
     
      const dataString = sessionStorage.getItem("response message");
      if (dataString) {
        try {
          const data = JSON.parse(dataString); 
          console.log("Parsed Data:", data);
          if (dbType === "JSON/CSV") {
            const storedFileSchema = JSON.parse(sessionStorage.getItem("Primary Schema") || "[]");
            console.log("Schema to be used for reordering:", storedFileSchema);
            const reorderedData = reorderData(data, storedFileSchema);
            setTableData(reorderedData);
          } else {
            setTableData(data);
          }
          console.log(tableData)
          setLoadingData(false);
        } catch (error) {
          console.error("Error parsing session storage data:", error);
          setTableData([]); // Set empty data if parsing fails
        }
      } else {
        console.warn("No data found in sessionStorage for 'response message'");
        setTableData([]); // Set empty data if no data found
      }
    } else if (dbType === "CloudSql") {
      const tableName = sessionStorage.getItem("selectedPrimaryTable");

      if (!tableName) {
        console.error("No table selected for CloudSQL.");
        alert("No table selected.");
        setLoadingData(false);
        return;
      }
      const dataString = sessionStorage.getItem("response message");
      const dataString1 = sessionStorage.getItem("Generate Data");

      // Parse the string back to a JSON object
      const data = JSON.parse(dataString);
      const data1 = JSON.parse(dataString1);
      console.log("hello", data1);
      // Safely access synthetic_data
      const syntheticData = data; // Use optional chaining for safety
      console.log(syntheticData);
      setTableData(syntheticData);

      const syntheticData1 = data1; // Use optional chaining for safety
      console.log("sdg1",syntheticData1);
      setTableData1(syntheticData1);
      setLoadingData(false);
    }
  };

  // const extractTableName = (message) => {
  //   const regex = /Successfully loaded.*into \S+\.\S+\.(\w+)/;
  //   const match = message.match(regex);

  //   if (match && match[1]) {
  //     return match[1];  // Return the table name
  //   }
  //   return null;
  // };

  useEffect(() => {
    const projectId = "brlcto-btaasgcp";
    sessionStorage.setItem("project_id", projectId);
  }, []);

  const toggleExpansion = (rowIndex, field) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [`${rowIndex}-${field}`]: !prevExpanded[`${rowIndex}-${field}`],
    }));
  };
  const expandAll = () => {
    const newExpanded = {};
    tableData.forEach((_, rowIndex) => {
      Object.keys(tableData[rowIndex]).forEach((field) => {
        if (typeof tableData[rowIndex][field] === 'object' && tableData[rowIndex][field] !== null) {
          newExpanded[`${rowIndex}-${field}`] = true;
        }
      });
    });
    setExpanded(newExpanded);
  };

  const collapseAll = () => {
    setExpanded({});
  };
  const renderNestedTable = (data, parentKey) => {
    if (!data || (!Array.isArray(data) && typeof data !== "object"))
      return null;

    const nestedData = Array.isArray(data) ? data : [data];
    const nestedHeaders = Object.keys(nestedData[0]);

    return (
      <TableContainer component={Paper} sx={{ boxShadow: "none", mb: 2 }}>
        <Table size="small" sx={{ backgroundColor: "#f5f5f5" }}>
          <TableHead>
            <TableRow>
              {nestedHeaders.map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#e0e0e0",
                    fontSize: "0.875rem",
                  }}
                >
                  {header
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
                    .replace(/\bID\b/g, "ID")
                    .trim()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {nestedData.map((item, idx) => (
              <TableRow key={`${parentKey}-${idx}`}>
                {nestedHeaders.map((header) => (
                  <TableCell
                    key={`${parentKey}-${idx}-${header}`}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {typeof item[header] === "object" &&
                      item[header] !== null ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            toggleExpansion(`${parentKey}-${idx}`, header)
                          }
                        >
                          {expanded[`${parentKey}-${idx}-${header}`] ? (
                            <Remove />
                          ) : (
                            <Add />
                          )}
                        </IconButton>
                        <Typography variant="body2">View details</Typography>
                        {/* Recursive call for deeper nested data */}
                        {expanded[`${parentKey}-${idx}-${header}`] &&
                          renderNestedTable(
                            item[header],
                            `${parentKey}-${idx}-${header}`
                          )}
                      </Box>
                    ) : (
                      item[header]?.toString() || "-"
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  const dbUser = process.env.REACT_APP_DB_USER;
  const dbPass = process.env.REACT_APP_DB_PASS;
  const dbName = process.env.REACT_APP_DB_NAME;
  const instanceName = process.env.REACT_APP_INSTANCE_NAME;
  const tableName = sessionStorage.getItem("selectedPrimaryTable");

  const pushDataToFirestore = async () => {
    const collectionName = "Orders";
    const url =
      "https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/push-firestore-data?project_id=brlcto-btaasgcp";
    const data = {
      project_id: "brlcto-btaasgcp",
      collection_name: "Orders",
      synthetic_data: JSON.parse(sessionStorage.getItem("response message")),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.message === "Data pushed successfully") {
        setAlertMessage("Data successfully pushed to Firestore!");
        setShowSuccessAlert(true);
        console.log("Success:", result.message);
      } else {
        // console.error("Unexpected response:", result);
      }
    } catch (error) {
      console.error("Error pushing data to Firestore:", error);
    }
  };

  const pushDataToBigQuery = async () => {
    const tableId = sessionStorage.getItem("selectedTable");
    if (!tableId) {
      console.error("No table ID found in sessionStorage.");
      return;
    }
    const url = `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/upload-synthetic-data?project_id=brlcto-btaasgcp&dataset_id=btaastest&table_id=${tableId}`;

    const data = {
      project_id: "brlcto-btaasgcp",
      dataset_id: "btaastest",
      table_id: tableId, // Use the dynamically set table ID from sessionStorage
      synthetic_data: JSON.parse(sessionStorage.getItem("response message")),
      schema: JSON.parse(sessionStorage.getItem("Primary Schema")),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.message && result.message.includes("Successfully uploaded")) {
        setAlertMessage(`${result.message}`);
        setShowSuccessAlert(true);
        console.log("Success:", result.message);
      } else {
        console.error("Unexpected response:", result);
      }
    } catch (error) {
      console.error("Error pushing data to BigQuery:", error);
    }
  };

  const pushDataToCloudSql = async () => {
    const url =
      "https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/push-synthetic-data-sql?project_id=brlcto-btaasgcp";
    const primaryTable = sessionStorage.getItem("selectedPrimaryTable");
    const referenceTable = sessionStorage.getItem("selectedReferenceTable");
    const tables = [
      { name: primaryTable, type: "Primary Table" },
      { name: referenceTable, type: "Reference Table" },
    ];
    const data = {
      project_id: "brlcto-btaasgcp",
      location: "us-central1",
      instance_name: instanceName,
      db_user: dbUser,
      db_pass: dbPass,
      db_name: dbName,
      table_name: tableName,
      synthetic_data: JSON.parse(sessionStorage.getItem("response message")),
      schema: JSON.parse(sessionStorage.getItem("Primary Schema")),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.message === "Data push completed") {
        setAlertMessage(
          `Data push is completed successfully to Customers and Orders! 
          Total Rows: ${result.summary.total_rows}, 
          Inserted Rows: ${result.summary.inserted_rows}, 
          Failed Rows: ${result.summary.failed_rows}, 
          Success Rate: ${result.summary.success_rate}%`
        );

        setShowSuccessAlert(true);
        console.log("Success:", result);
        const referenceTableMessage = `Data push completed successfully to Reference Table! 
        Total Rows: ${result.summary.total_rows}, 
        Inserted Rows: ${result.summary.inserted_rows}, 
        Failed Rows: ${result.summary.failed_rows}, 
        Success Rate: ${result.summary.success_rate}%`;
      } else {
        console.error("Unexpected response:", result);
      }
    } catch (error) {
      console.error("Error pushing data to Cloud SQL:", error);
    }
  };
  const downloadSyntheticData = async () => {
   
    try {
      const responseMessage = sessionStorage.getItem("response message");
      const synthetic_data = responseMessage ? JSON.parse(responseMessage) : null;
      const schema = JSON.parse(sessionStorage.getItem("Primary Schema") || "[]");
      const file_type = sessionStorage.getItem("fileType");
      const url = 'https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/download-generated-data?project_id=brlcto-btaasgcp';
     
     
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ synthetic_data, file_type, schema })
      });
     
     
 
      if (!response.ok) {
        throw new Error('Failed to download data: ' + response.statusText);
      }
 
      console.log("result", response)
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      // const fileType = sessionStorage.getItem("fileType");
      a.style.display = 'none';
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      a.href = (file_type==="csv")?`https://storage.googleapis.com/tempbucketbtaasgcp/generated_data.csv?ts=${timestamp}`:`https://storage.googleapis.com/tempbucketbtaasgcp/generated_data.json?ts=${timestamp}`
     
      //a.href=downloadUrl
      a.download = 'generated-data';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      setShowSuccessAlert(true);
      setAlertMessage('Download completed successfully!');
    } catch (error) {
      // console.error('Error downloading the data:', error);
      setShowSuccessAlert(true);
      setAlertMessage('Failed to download data. Please try again later.');
    }
  };
  

  const saveSyntheticData = async () => {
    if (dbType === "GitHub") {
      const params = {
        parsedData: syntheticData,
        selectedBranch: destBranch,
        fileName,
        selectedRepo: destRepo,
        fileType: "." + fileType,
        gitpat: gitSetupCred.pat,
        repoOwner: gitSetupCred.repoOwner,
      };
      // dispatch(pushInGithub(params));
    } else if (dbType === "Back To DB") {
      const params =
        dbType === "CloudSql"
          ? {
            connectionName: genericDbCred.connectionName,
            dbName: genericDbCred.dbName,
            username: genericDbCred.username,
            password: genericDbCred.password,
            selectedTable,
            parsedData: syntheticData,
            dbType: "CloudSql",
          }
          : {
            dbType,
            keyFile: dataStoreCred.keyFile,
            selectedTable,
            parsedData: JSON.stringify(syntheticData),
          };
      // dispatch(backToDb(params));
    } else if (dbType === "Firestore") {
      await pushDataToFirestore();
    } else if (dbType === "BigQuery") {
      await pushDataToBigQuery();
    } else if (dbType === "CloudSql") {
      await pushDataToCloudSql();
    }
  };
  

  // Function to determine if Save button should be disabled
  const isSaveButtonDisabled = () => {
    if (dbType === "GitHub")
      return !destRepo || !destBranch || !fileType || !fileName;
    return false;
  };

  return (
    <Box sx={{ minWidth: 140 }}>
    <div className="row">
      <div className="col-md-12">
        {/* Message indicating successful data validation */}
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        {dbType === "JSON/CSV"
          ? "The Data Validation has been completed successfully. Click here to download the file."
          : "The Data Validation has been completed successfully. Click on Save to push the data."}
      </Typography>
      </div>
      <div className="col-md-3">
        {destination !== "GitHub" && (
          <Button
            disabled={isSaveButtonDisabled()}
            sx={{ marginLeft: "3%" }}
            variant="contained"
            onClick={
              dbType === "JSON/CSV"
                ? downloadSyntheticData // Trigger Download function
                : saveSyntheticData // Trigger Save function
            } //Trigger Save function
          >
           {dbType === "JSON/CSV" ? "Download" : "Save"}
          </Button>
        )}
      </div>
    </div>

      <div>
        <div>
          {/* Conditionally render alert based on the showSuccessAlert state */}
          {showSuccessAlert && (
            <Alert
              onClose={() => setShowSuccessAlert(false)}
              severity="info"
              sx={{ marginTop: "50px", width: "100%" }}
            >
              {alertMessage}
            </Alert>
          )}
        </div>
    
        {showSuccessAlert && (
          <Box
            sx={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            <Typography variant="body1" sx={{ marginRight: "10px" }}>
            The generated data is available for review.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: '8px', 
                boxShadow: 3,       
                '&:hover': {
                  boxShadow: 6,      
                },
                padding: '6px 16px', 
              }}
              onClick={handleViewData} 
            >
              View
            </Button>
          </Box>
        )}
      

        {loadingData ? (
          <CircularProgress sx={{ marginTop: "20px" }} />
        ) : tableData && tableData?.length > 0 ? (
          <Box sx={{ marginTop: 4 }}>
            {/* Header */}
            <Typography variant="h6" component="h6" gutterBottom>
              {dbType === "Firestore" || dbType === "BigQuery" ? (
                "Generated Synthetic Data"
              ) : dbType === "CloudSql" ? (
                <>
                  <div>Primary Table: Customers </div>
                </>
              ) : null}
            </Typography>

            {/* Auto-generated Note - Only for CloudSql */}
            {/* {sessionStorage.getItem("dbType") === "CloudSql" && (
                <Typography
                  variant="body1"
                  component="p"
                  sx={{ marginBottom: 2, color: "blue" }}
                >
                  (*) - The customer_id will be autogenerated while pushing into CloudSql Database.
                </Typography>
              )} */}
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              {(() => {
                const maskingColumns = sessionStorage.getItem("maskingcolumns");
                const redundancyColumns =
                  sessionStorage.getItem("redundancycolumns");
                const redundantColumns =
                  sessionStorage.getItem("redundantcolumns");
                const dbType = sessionStorage.getItem("dbType");

                console.log("maskingColumns:", maskingColumns);
                console.log("redundancyColumns:", redundancyColumns);
                console.log("redundantColumns:", redundantColumns);
                console.log("dbType:", dbType);

                return (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {/* CloudSql */}
                    {dbType === "CloudSql" && (
                      <>
                        {maskingColumns && (
                          <Typography variant="body2" component="div">
                            <strong>Sensitive Columns:</strong>{" "}
                            {maskingColumns}
                          </Typography>
                        )}
                        {redundancyColumns && (
                          <Typography variant="body2" component="div">
                            <strong>Unique Columns:</strong>{" "}
                            {redundancyColumns}
                          </Typography>
                        )}
                      </>
                    )}

                    {/* Firestore or Bigquery */}
                    {(dbType === "Firestore" || dbType === "BigQuery"|| dbType === "JSON" || dbType === "CSV" ) && (
                      <>
                        {maskingColumns && (
                          <Typography variant="body2" component="div">
                            <strong>Sensitive Columns:</strong>{" "}
                            {maskingColumns}
                          </Typography>
                        )}
                        {redundancyColumns && (
                          <Typography variant="body2" component="div">
                            <strong>Unique Columns :</strong>{" "}
                            {redundancyColumns}
                          </Typography>
                        )}
                         {sessionStorage.getItem('dbType') === 'BigQuery' &&
    sessionStorage.getItem('selectedTable') === 'order' && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "-50px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={expandAll}
                            sx={{ marginRight: 3 }}

                          >
                            Expand All
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={collapseAll}
                            sx={{ backgroundColor: "primary.main" }}
                          >
                            Collapse All
                          </Button>
                        </div>
                        )}
                      </>
                    )}
                  </Box>
                );
              })()}
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ tableLayout: "auto" }}>
                <TableHead>
                  <TableRow>
                    {console.log("Rendering table with data:", tableData)}
                    {Object.keys(tableData[0]).map((column) => (
                      <TableCell
                        key={column}
                        align="left"
                        sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                      >
                        {column
                          .replace(/([a-z])([A-Z])/g, "$1 $2")
                          .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
                          .replace(/\bID\b/g, "ID")
                          .trim()}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row, index) => (
                      <TableRow key={index}>
                        {Object.keys(row).map((field, idx) => (
                          <TableCell
                            key={idx}
                            sx={{
                              fontSize: "0.875rem",
                              maxWidth: "450px",
                              padding: "9px 16px",
                              whiteSpace: "normal", 
                              wordWrap: "break-word", 
                              overflow: "hidden", 
                              textOverflow: "ellipsis",
                              
                            }}
                          >
                            {typeof row[field] === "object" &&
                              row[field] !== null ? (
                              <Box sx={{ maxWidth: "700px" }}>
                                <IconButton
                                  size="small"
                                  onClick={() => toggleExpansion(index, field)}
                                >
                                  {expanded[`${index}-${field}`] ? (
                                    <Remove />
                                  ) : (
                                    <Add />
                                  )}
                                </IconButton>
                                <Typography variant="body2">
                                  View details
                                </Typography>

                                {/* Nested Table below View details */}
                                {expanded[`${index}-${field}`] && (
                                  <Box>
                                    {renderNestedTable(
                                      row[field],
                                      `${index}-${field}`
                                    )}
                                  </Box>
                                )}
                              </Box>
                            ) : field.includes("customer_id") &&
                              (row[field] === null ||
                                row[field] === undefined) ? (
                              "*"
                            ) : (
                              row[field]?.toString() || "-"
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end", // Align all items to the right side
                alignItems: "center", // Center align vertically
                width: "100%",
                padding: "8px 0",
              }}
            >
              <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              // style={{ overflow: 'hidden' }}
              />
            </div>
            {dbType === "CloudSql" ? (
              <>
              <Typography variant="h6" gutterBottom>
                <div>Reference Table: Orders</div>
              </Typography>
            
            <TableContainer component={Paper}>
              <Table sx={{ tableLayout: "auto" }}>
                <TableHead>
                  <TableRow>
                    {Object.keys(tableData1[0]).map((column) => (
                      <TableCell
                        key={column}
                        align="left"
                        sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                      >
                        {column
                          .replace(/([a-z])([A-Z])/g, "$1 $2")
                          .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
                          .replace(/\bID\b/g, "ID")
                          .trim()}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData1
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row, index) => (
                      <TableRow key={index}>
                        {Object.keys(row).map((field, idx) => (
                          <TableCell
                            key={idx}
                            sx={{
                              fontSize: "0.875rem",
                              maxWidth: "500px",
                              padding: "9px 16px",
                            }}
                          >
                            {typeof row[field] === "object" &&
                              row[field] !== null ? (
                              <Box sx={{ maxWidth: "700px" }}>
                                <IconButton
                                  size="small"
                                  onClick={() => toggleExpansion(index, field)}
                                >
                                  {expanded[`${index}-${field}`] ? (
                                    <Remove />
                                  ) : (
                                    <Add />
                                  )}
                                </IconButton>
                                <Typography variant="body2">
                                  View details
                                </Typography>

                                {/* Nested Table below View details */}
                                {expanded[`${index}-${field}`] && (
                                  <Box>
                                    {renderNestedTable(
                                      row[field],
                                      `${index}-${field}`
                                    )}
                                  </Box>
                                )}
                              </Box>
                            ) : field.includes("discount") &&
                              (row[field] === null ||
                                row[field] === undefined) ? (
                              "0"
                            ) : (
                              row[field]?.toString() || "-"
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end", // Align all items to the right side
                alignItems: "center", // Center align vertically
                width: "100%",
                padding: "8px 0",
              }}
            >
              <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                count={tableData1.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              // style={{ overflow: 'hidden' }}
              />
            </div>
            </>
            ) : null}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ marginTop: "20px" }}>
            {/* No data available */}
          </Typography>
        )}
      </div>
      
      {destination === "GitHub" && (
        <Box
          sx={{
            display: "flex",
            paddingTop: "5%",
            alignItems: "center",
            flexDirection: "column",
            "& .MuiTextField-root": { m: 1 },
          }}
        >
          <Typography variant="h5">GitHub Details</Typography>
          {/* Rest of the GitHub form remains the same */}
        </Box>
      )}

      {(isBacktoDbLoading || isPushInGithubLoading) && <Loader />}
      {/* <Snackbar
        open={Boolean(backToDbResp || pushInGithubResp || showSuccessAlert)}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
      >

      </Snackbar> */}
    </Box>
  );
}
