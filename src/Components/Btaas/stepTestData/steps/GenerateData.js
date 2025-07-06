/**
 * @file GenerateData.js
 * This script is responsible for handling the generation and management of synthetic data for various database types (Cloud SQL, BigQuery, Firestore, JSON, CSV). 
   It includes logic for generating and displaying relational database data, setting page data, and managing nested table structures for expanded views based 
   on the datasources selected.
 * 
 * Key Features:
 * - Handles the generation of synthetic data for different database types including Cloud SQL, BigQuery, Firestore, and JSON/CSV formats.
 * - Fetches data from relational databases (using relationalDbUrl) and sorts them based on customerID.
 * - Supports pagination and dynamic rows per page display.
 * - Includes nested table rendering for handling expandable data structures.
 * - Enables the functionality to expand/collapse nested data for each row.
 * - Sets the expanded state for nested fields based on data structure.
 * - Updates and stores data in sessionStorage for reuse across the session.
 * 
 * Functions:
 * - handleGenerateCloudSqlData: Handles data generation for Cloud SQL database.
 * - handleGenerateBigQueryData: Handles data generation for BigQuery database.
 * - handleGenerateFirestoreData: Handles data generation for Firestore database.
 * - handleGenerateJsonCsvData: Handles data generation for JSON/CSV data formats.
 * - setRelationalDB: Sets sessionStorage for relational database type.
 * - initializeExpandedState: Initializes the expanded state for nested data fields.
 * - handleChangePage: Handles page change for pagination.
 * - handleChangeRowsPerPage: Handles change in the number of rows per page.
 * - toggleExpansion: Toggles the expansion state of a row for nested data fields.
 * - expandAll: Expands all nested fields for all rows.
 * - collapseAll: Collapses all nested fields for all rows.
 * - renderNestedTable: Renders nested tables for expandable rows.
 * 
 */
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
  IconButton,
  // Collapse
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Add, Remove } from '@mui/icons-material';
import { InfoOutlined } from '@mui/icons-material';
// import StarIcon from '@mui/icons-material/Star';
// import { json } from "react-router-dom";
export default function GenerateData() {
  const {
    // syntheticData,
    isSyntheticDataLoading,
    // selectedTable,
  } = useSelector((state) => state.btaasTestData);
  const [selectedTableName, setSelectedTableName] = useState('');
  // const [selectedReferenceTable, setSelectedReferenceTable] = useState('');
  const [generateData, setGeneratedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataCounter, setDataCounter] = useState("");
  const [dbType, setDbType] = useState("");
  const [expanded, setExpanded] = useState({});
  const [progress, setProgress] = useState(0);
  const [totalRecords, setTotalRecords] = useState(null);  // For storing total records
  const [validationSummary, setValidationSummary] = useState(null);
  const [isFirstGeneration, setIsFirstGeneration] = useState(true);
  const [isCloudSqlGenerated, setIsCloudSqlGenerated] = useState(false);
  const [isRelationalDbGenerated, setIsRelationalDbGenerated] = useState(false);
  const [relationalData, setRelationalDBData] = useState([]);
  const [isJSONCSVGenerated, setIsJSONCSVGenerated] = useState(false);
  const [page, setPage] = useState(0);
  // const [Relationaldbtype,setRelationaldbtype] = useState();

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();

  useEffect(() => {
    const projectId = "brlcto-btaasgcp";
    sessionStorage.setItem("project_id", projectId);
    const dbType = sessionStorage.getItem("dbType");
    // setRelationaldbtype(sessionStorage.getItem("Relationaldbtype"))
    setDbType(dbType);
  }, []);

  const getProjectId = () => {
    return sessionStorage.getItem("project_id");
  };
  const intervalRef = useRef(null);
  useEffect(() => {
    if (loading) {
      intervalRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress === 100) {
            clearInterval(intervalRef.current);
            return 100;
          }
          return Math.min(prevProgress + 10, 100); // Update the progress every 10%
        });
      }, 500);
    }

    // Cleanup the interval when the component unmounts or loading changes
    return () => clearInterval(intervalRef.current);
  }, [loading]);

  const handleGenerateBigQueryData = (event) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedData([]);

    const selectedTable = sessionStorage.getItem("selectedTable");
    // const data = new FormData(event.currentTarget);
    const dataCount = dataCounter;
    const projectId = getProjectId();
    const numRows = parseInt(dataCount, 10);
    const masked_fields = sessionStorage.getItem("maskingcolumns")
    const selectedcolumns = sessionStorage.getItem("redundancycolumns");
    setSelectedTableName(selectedTable);
    const bigQueryUrl = `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/testmasking/generate-synthetic-data?project_id=${projectId}&dataset_id=btaastest&table_id=${selectedTable}&num_rows=${numRows}&columns=${selectedcolumns}&masked_fields=${masked_fields}`;

    fetch(bigQueryUrl, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(err)}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        // Sort data by customerID if it exists
        const sortedData = data.gemini_data.sort((a, b) => {
          if (a.customerID && b.customerID) {
            return a.customerID.localeCompare(b.customerID);
          }
          return 0;
        });
        setGeneratedData(sortedData);
        setProgress(100)
        sessionStorage.setItem("response message", JSON.stringify(data.synthetic_data))
        setIsFirstGeneration(false); // Update to indicate that data has been generated at least once
        initializeExpandedState(sortedData);
      })
      .catch((error) => {
        // console.error("Error generating BigQuery data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleGenerateFirestoreData = (event) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedData([]);
    // const data = new FormData(event.currentTarget);
    const dataCount = dataCounter;
    const projectId = getProjectId();
    const numRows = parseInt(dataCount, 10);
    const masked_fields = sessionStorage.getItem("maskingcolumns")
    const selectedcolumns = sessionStorage.getItem("redundancycolumns");
    console.log("Columns to be used for redundancy:", selectedcolumns);
    const requestBody = {
      project_id: projectId,
      collection_name: "Orders",
      row_count: numRows,
      columns: selectedcolumns,
      masked_fields: ""
    };
    setSelectedTableName("Orders");
    fetch(`https://us-central1-brlcto-btaasgcp.cloudfunctions.net/testmasking/generate-firestore-data?project_id=brlcto-btaasgcp&masked_fields=${masked_fields}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(err)}`);
          });
        }
        return response.json();
      })
      .then((data) => {

        const sortedData = data.gemini_data.sort((a, b) => {
          const idA = a.customerID ? String(a.customerID) : '';
          const idB = b.customerID ? String(b.customerID) : '';
          return idA.localeCompare(idB);
        });

        setGeneratedData(sortedData);
        sessionStorage.setItem("response message", JSON.stringify(data.synthetic_data))
        setProgress(100)
        setIsFirstGeneration(false); // Update to indicate that data has been generated at least once
        initializeExpandedState(sortedData);
      })
      .catch((error) => {
        console.error("Error generating Firestore data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleGenerateJsonCsvData = (event) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedData([]);

    // Get the schema from session storage
    const storedFileSchema = JSON.parse(sessionStorage.getItem("Primary Schema") || "[]");
    console.log("Schema to be used:", storedFileSchema);
    const projectId = getProjectId();
    const dataCount = dataCounter; // Assumes dataCounter is set elsewhere
    const numRows = parseInt(dataCount, 10);
    const fileType = sessionStorage.getItem("fileType");
    const selectedcolumns = sessionStorage.getItem("redundancycolumns");
    const masked_fields = sessionStorage.getItem("maskingcolumns");

    const reorderData = (data, schema) => {
      // Flatten the schema to get the column names in order
      const columnOrder = schema.map(item => item.name);
  
      return data.map((row, rowIndex) => {
        const reorderedRow = {};
        
        columnOrder.forEach((columnName) => {
          // For nested columns, handle it accordingly
         
          let value = row[columnName];
          if (value && typeof value === "object") {
            value = JSON.stringify(value); // You can adjust this depending on how you want to represent the object
          }
          console.log(`Row ${rowIndex} - Column: ${columnName}, Value: ${value}`);
          if (value === undefined) {
            reorderedRow[columnName] = ""; // You can set it to any default value, e.g., empty string or null
          } else {
            reorderedRow[columnName] = value;
          }
        });
        return reorderedRow;
      });
    };
    
    // Construct the request body
    const requestBody = {
      project_id: projectId,
      row_count: numRows,
      schema: storedFileSchema,
      file_type: fileType,
      columns: selectedcolumns,
      masked_fields: masked_fields
    };

    fetch(`https://us-central1-brlcto-btaasgcp.cloudfunctions.net/testmasking/generate-synthetic-data-csv?project_id=brlcto-btaasgcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(err)}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Generated Data:", data);
        const sortedData = data.gemini_data.sort((a, b) => {
          
          const idA = a.customerID ? String(a.customerID) : '';
          const idB = b.customerID ? String(b.customerID) : '';
          return idA.localeCompare(idB);
        });
        const reorderedData = reorderData(sortedData, storedFileSchema);
        setGeneratedData(reorderedData);
        sessionStorage.setItem("response message", JSON.stringify(data.generated_data));
        setProgress(100);
        setIsFirstGeneration(false); 
        initializeExpandedState(sortedData);
      })
      .catch((error) => {
        // console.error("Error generating JSON/CSV data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGenerateCloudSqlData = (event) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedData([]); // Clear any previous data

    // const data = dataCount;
    const dataCount = dataCounter;
    const projectId = getProjectId();
    const numRows = parseInt(dataCount, 10);
    const masked_fields = sessionStorage.getItem("maskingcolumns")
    const columns = sessionStorage.getItem("redundancycolumns")
    // Retrieve other necessary parameters from session storage
    const dbUser = process.env.REACT_APP_DB_USER;
    const dbPass = process.env.REACT_APP_DB_PASS;
    const dbName = process.env.REACT_APP_DB_NAME;
    const instanceName = process.env.REACT_APP_INSTANCE_NAME;
    const tableName = sessionStorage.getItem("selectedPrimaryTable");

    console.log('DB User:', dbUser);
    console.log('DB Pass:', dbPass);
    console.log('DB Name:', dbName);
    console.log('Instance Name:', instanceName);
    // console.log(data); 
    console.log(totalRecords);
    console.log(validationSummary);


    setSelectedTableName(tableName);


    const cloudSqlUrl = `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/testmasking/generate-synthetic-data-sql?project_id=brlcto-btaasgcp`;


    const requestBody = {
      project_id: projectId,
      location: "us-central1",
      instance_name: "sdg",
      db_user: dbUser,
      db_pass: dbPass,
      db_name: dbName,
      table_name: tableName,
      row_count: numRows,
      masked_fields: masked_fields,
      columns: columns,
    };


    fetch(cloudSqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(err)}`);
          });
        }
        return response.json();
      })
      .then((data) => {

        const sortedData = data.gemini_data.sort((a, b) => {
          if (a.customerID && b.customerID) {
            return a.customerID.localeCompare(b.customerID);
          }
          return 0;
        });


        setGeneratedData(sortedData);
        sessionStorage.setItem("response message", JSON.stringify(data.synthetic_data))
        setProgress(100)
        setIsCloudSqlGenerated(true);
        // setIsFirstGeneration(false); 
        initializeExpandedState(sortedData);
      })
      .catch((error) => {
        console.error("Error generating CloudSQL data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleGenerateRelationalDbData = (event) => {
    event.preventDefault();
    setLoading(true);
    setRelationalDBData([]);
    console.log("Hello");
    // const data = event.target.value;
    const dataCount = dataCounter;
    const projectId = getProjectId();
    const numRows = parseInt(dataCount, 10);
    console.log(dbType);

    const dbUser = process.env.REACT_APP_DB_USER;
    const dbPass = process.env.REACT_APP_DB_PASS;
    const dbName = process.env.REACT_APP_DB_NAME;
    const instanceName = process.env.REACT_APP_INSTANCE_NAME;
    const referencedTable = sessionStorage.getItem("selectedPrimaryTable");
    const tableName = sessionStorage.getItem("selectedReferenceTable");
    const foreignKeyColumn = sessionStorage.getItem("selectedReferenceField");
    const referenceColumn = sessionStorage.getItem("selectedPrimaryField");
    const mask_fields = sessionStorage.getItem("maskedcolumns")

    const relationalDbUrl = `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt3-masking`;


    const requestBody = {
      project_id: projectId,
      location: "us-central1",
      instance_name: "sdg",
      db_user: dbUser,
      db_pass: dbPass,
      db_name: dbName,
      table_name: tableName,
      referenced_table: referencedTable,
      foreign_key_column: foreignKeyColumn,
      reference_column: referenceColumn,
      row_count: numRows,
      mask_fields: [mask_fields]
    };


    fetch(relationalDbUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(err)}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        const sortedData = data.gemini_data.sort((a, b) => {
          if (a.customerID && b.customerID) {
            return a.customerID.localeCompare(b.customerID);
          }
          return 0;
        });

        setRelationalDBData(sortedData);
        sessionStorage.setItem("Generate Data", JSON.stringify(data.synthetic_data))
        setIsRelationalDbGenerated(true);
        setProgress(100)
        // setIsFirstGeneration(false);
        initializeExpandedState(sortedData);
      })
      .catch((error) => {
        console.error("Error generating relational DB data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const setRelationalDB = () => {
    sessionStorage.setItem("dbType", "relationaldb")
  }

  const initializeExpandedState = (data) => {
    const newExpandedState = {};
    data.forEach((row, rowIndex) => {
      Object.keys(row).forEach((field) => {
        if (typeof row[field] === 'object' && row[field] !== null) {
          newExpandedState[`${rowIndex}-${field}`] = true; // Set to true to expand by default
        }
      });
    });
    setExpanded(newExpandedState);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // const displayData = generateData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const toggleExpansion = (rowIndex, field) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [`${rowIndex}-${field}`]: !prevExpanded[`${rowIndex}-${field}`],
    }));
  };
  const expandAll = () => {
    const newExpanded = {};
    generateData.forEach((_, rowIndex) => {
      Object.keys(generateData[rowIndex]).forEach((field) => {
        if (typeof generateData[rowIndex][field] === 'object' && generateData[rowIndex][field] !== null) {
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
    if (!data || (!Array.isArray(data) && typeof data !== 'object')) return null;

    const nestedData = Array.isArray(data) ? data : [data];
    const nestedHeaders = Object.keys(nestedData[0]);


    return (
      <TableContainer component={Paper} sx={{ boxShadow: 'none', mb: 2 }}>
        <Table size="small" sx={{ backgroundColor: '#f5f5f5' }}>
          <TableHead>
            <TableRow>
              {nestedHeaders.map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#e0e0e0',
                    fontSize: '0.875rem'
                  }}
                >
                  {header
                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
                    .replace(/\bID\b/g, 'ID')
                    .trim()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {nestedData.map((item, idx) => (
              <TableRow key={`${parentKey}-${idx}`}>
                {nestedHeaders.map((header) => (
                  <TableCell key={`${parentKey}-${idx}-${header}`} sx={{ fontSize: '0.875rem' }}>
                    {typeof item[header] === 'object' && item[header] !== null ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">View details</Typography>
                        {renderNestedTable(item[header], `${parentKey}-${idx}-${header}`)}
                      </Box>
                    ) : (
                      item[header]?.toString() || '-'
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
  return (
    <Box sx={{ minWidth: 140 }}>
      {/* <Box component="form"
  onSubmit={dbType === 'BigQuery' 
    ? handleGenerateBigQueryData 
    : dbType === 'Firestore' 
    ? handleGenerateFirestoreData 
    // : dbType === 'CloudSql' 
    // ? handleGenerateCloudSqlData 
    // : dbType === 'relationaldb'
    // ? handleGenerateRelationalDbData
    : ""}
  sx={{ paddingTop: "3%" }}
> */}
      <div className="row">
        <div className="col-md-3">
          <TextField
            required
            id="outlined-number"
            name="dataCounter"
            label="Synthetic Data Row Count"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: 1,
              required: true,
            }}
            value={dataCounter}
            onChange={(e) => setDataCounter(e.target.value)}
            
          />
        </div>

        {dbType === 'CloudSql' && (
          <>
            <div className="col-md-3">
              <Button
                sx={{ marginLeft: "3%" }}
                variant="contained"
                type="button"
                disabled={!dataCounter || parseInt(dataCounter) <= 0}
                onClick={handleGenerateCloudSqlData}
              >
                {isCloudSqlGenerated ? "Regenerate Primary Table" : "Generate Primary Table"}
              </Button>
            </div>
            <div className="col-md-3">
              <Button
                sx={{ marginLeft: "3%" }}
                variant="contained"
                type="button"
                disabled={!isCloudSqlGenerated ||!dataCounter || parseInt(dataCounter) <= 0}
                onClick={handleGenerateRelationalDbData}
              >
                {isRelationalDbGenerated ? "Regenerate Reference Table" : "Generate Reference Table"}
              </Button>
            </div>
          </>
        )}

        {dbType === 'BigQuery' && (
          <div className="col-md-3">
            <Button
              sx={{ marginLeft: "3%" }}
              variant="contained"
              type="button"
              onClick={handleGenerateBigQueryData}
              disabled={!dataCounter || parseInt(dataCounter) <= 0}
            >
              {isFirstGeneration ? "Generate BigQuery Data" : "Regenerate BigQuery Data"}
            </Button>
          </div>
        )}

        {dbType === 'Firestore' && (
          <div className="col-md-3">
            <Button
              sx={{ marginLeft: "3%" }}
              variant="contained"
              type="button"
              onClick={handleGenerateFirestoreData}
              disabled={!dataCounter || parseInt(dataCounter) <= 0}
            >
              {isFirstGeneration ? "Generate Firestore Data" : "Regenerate Firestore Data"}
            </Button>
          </div>
        )}

        {(dbType === "JSON" || dbType === "CSV") ? (
          <div className="col-md-3">
            <Button
              sx={{ marginLeft: "3%" }}
              variant="contained"
              type="button"
              disabled={!dataCounter || parseInt(dataCounter) <= 0}
              onClick={handleGenerateJsonCsvData}
            >
              {isJSONCSVGenerated ? "Regenerate JSON/CSV Data" : "Generate JSON/CSV Data"}
            </Button>
          </div>
        ) : null}


      </div>
      {/* </Box> */}




      {(isSyntheticDataLoading || loading) && (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop: 4, position: "relative" }}>
          <CircularProgress size={40} thickness={5} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              position: "absolute",
              color: "text.primary",
            }}
          >
            {/* {progress}% */}
          </Typography>
        </Box>
      )}

      {generateData.length > 0 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" component="h5" gutterBottom>
            {dbType === "CloudSQL"
              ? " Sample Data"
              : dbType === "BigQuery"
                ? `Sample Data: ${sessionStorage.getItem("selectedTable")?.charAt(0).toUpperCase() + sessionStorage.getItem("selectedTable")?.slice(1)}`
                : dbType === "Firestore"
                  ? "Sample Data: Orders"
                  : dbType === "JSON" || dbType === "CSV"
                  ? "Sample Data"
                  : "Sample Primary Table: Customer"}
          </Typography>


          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <InfoOutlined sx={{ marginRight: 1, color: 'info.main' }} />
            <Typography variant="body2">
              Preview data generated by Gemini
            </Typography>
          </Box>
          <div style={{ float: 'right', gap: '10px', marginTop: '-50px' }}>
            {sessionStorage.getItem('dbType') === 'BigQuery' &&
              sessionStorage.getItem('selectedTable') === 'order' && (
                <>
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
                    sx={{ backgroundColor: 'primary.main' }}
                  >
                    Collapse All
                  </Button>
                </>
              )}
          </div>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(generateData[0]).map((header) => (
                    <TableCell
                      key={header}
                      align="left"
                      sx={{ fontWeight: "bold", textTransform: "uppercase", padding: "8px 16px" }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {generateData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={index}>
                    {Object.keys(row).map((field, idx) => (
                      <TableCell key={idx} sx={{ fontSize: '0.875rem', maxWidth: '500px', padding: "9px 16px" }}>
                        {typeof row[field] === 'object' && row[field] !== null ? (
                          <Box sx={{ maxWidth: '700px' }}>
                            <IconButton
                              size="small"
                              onClick={() => toggleExpansion(index, field)}
                            >
                              {expanded[`${index}-${field}`] ? <Remove /> : <Add />}
                            </IconButton>
                            <Typography variant="body2">View details</Typography>
                            {expanded[`${index}-${field}`] && renderNestedTable(row[field], `${index}-${field}`)}
                          </Box>
                        ) : (
                          row[field]?.toString() || '-'
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* <div style={{ marginTop: '20px' }}>
  <p>Preview data generated by Gemini</p>
</div> */}

          {dbType === "CloudSQL" && generateData.length > 0 && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h5" component="h5" gutterBottom>
                Sample Reference Data: {sessionStorage.getItem("selectedReferenceTable").charAt(0).toUpperCase() + sessionStorage.getItem("selectedReferenceTable").slice(1)};
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {Object.keys(generateData[0]).map((header) => (
                        <TableCell
                          key={header}
                          align="left"
                          sx={{ fontWeight: "bold", textTransform: "uppercase", padding: "8px 16px" }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {generateData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow key={index}>
                          {Object.keys(row).map((field, idx) => (
                            <TableCell key={idx} sx={{ fontSize: "0.875rem", maxWidth: "500px", padding: "6px 16px" }}>
                              {typeof row[field] === "object" && row[field] !== null ? (
                                <Box sx={{ maxWidth: "700px" }}>
                                  <IconButton size="small" onClick={() => toggleExpansion(index, field)}>
                                    {expanded[`${index}-${field}`] ? <Remove /> : <Add />}
                                  </IconButton>
                                  <Typography variant="body2">View details</Typography>
                                  {expanded[`${index}-${field}`] &&
                                    renderNestedTable(row[field], `${index}-${field}`)}
                                </Box>
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
              {/* Display the validation summary */}
              {validationSummary && validationSummary.results && (
                <Box sx={{ marginTop: 4 }}>
                  <Typography variant="h6" component="h6" gutterBottom>
                    Validation Summary
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Column</TableCell>
                          <TableCell>Expectation Type</TableCell>
                          <TableCell>Success</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {validationSummary.results.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.column}</TableCell>
                            <TableCell>{item.expectation_type}</TableCell>
                            <TableCell>{item.success ? "Success" : "Failure"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Display total records */}
              {totalRecords !== null && (
                <Box sx={{ marginTop: 4 }}>
                  <Typography variant="h6" component="h6" gutterBottom>
                    Total Records: {totalRecords}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          
          {dbType === "CloudSql" && relationalData.length > 0 && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6" component="h5" gutterBottom>
                Sample Reference Table: {sessionStorage.getItem("selectedReferenceTable").charAt(0).toUpperCase() + sessionStorage.getItem("selectedReferenceTable").slice(1)}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {Object.keys(relationalData[0]).map((header) => (
                        <TableCell
                          key={header}
                          align="left"
                          sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {relationalData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow key={index}>
                          {Object.keys(row).map((field, idx) => (
                            <TableCell key={idx} sx={{ fontSize: "0.875rem", maxWidth: "500px" }}>
                              {typeof row[field] === "object" && row[field] !== null ? (
                                <Box sx={{ maxWidth: "700px" }}>
                                  <IconButton size="small" onClick={() => toggleExpansion(index, field)}>
                                    {expanded[`${index}-${field}`] ? <Remove /> : <Add />}
                                  </IconButton>
                                  <Typography variant="body2">View details</Typography>
                                  {expanded[`${index}-${field}`] &&
                                    renderNestedTable(row[field], `${index}-${field}`)}
                                </Box>
                              ) : (
                                (field.includes("discount") && (row[field] === null || row[field] === undefined))
                                  ? "0"
                                  : row[field]?.toString() || "-"
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Display the validation summary */}
              {validationSummary && validationSummary.results && (
                <Box sx={{ marginTop: 4 }}>
                  <Typography variant="h6" component="h6" gutterBottom>
                    Validation Summary
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Column</TableCell>
                          <TableCell>Expectation Type</TableCell>
                          <TableCell>Success</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {validationSummary.results.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.column}</TableCell>
                            <TableCell>{item.expectation_type}</TableCell>
                            <TableCell>{item.success ? "Success" : "Failure"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Display total records */}
              {totalRecords !== null && (
                <Box sx={{ marginTop: 4 }}>
                  <Typography variant="h6" component="h6" gutterBottom>
                    Total Records: {totalRecords}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
  <TablePagination
    rowsPerPageOptions={[5, 10, 25, 50, 100]}
    count={generateData.length}
    rowsPerPage={rowsPerPage}
    component="div"
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}  
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px', // Add spacing between elements
      overflow: 'hidden',
    }}
   
  />
</div>

        </Box>
      )}

    </Box>
  );
}
