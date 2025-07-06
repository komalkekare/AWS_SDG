/**
 * @file GetTables.js
 * This script is responsible for getting the schema structure and details of synthetic data for various database types (Cloud SQL, BigQuery, Firestore, JSON, CSV). 
   It includes logic for getting tables, including the sensitive and unique fields for different data sources using DLP (Data Loss Prevention) Mechanism.
 *
  * Key Features:
 * - Handles the generation of schema structures for different database types including Cloud SQL, BigQuery, Firestore, and JSON/CSV formats.
 * - Supports pagination and dynamic rows per page display.
 * - Inputs data from user and marks the sensitive and unique fields, thus, improving security and maintaining confidentiality.
 *
 Functions:
 * handlePrimaryFieldChange: This function updates the selected primary field, marks it as redundant and disabled, stores the updated field in sessionStorage, 
   and tracks the redundancy columns in sessionStorage.
*  handleReferenceFieldChange: This function handles the selection of reference fields and checkboxes, updating the selected values in the state and 
   storing them in sessionStorage for persistence across page reloads.
*  handleFirestoreCheckboxChange: Updates the selected collection in Firestore based on the checkbox selection and stores it in sessionStorage.
*  handlePrimaryCheckboxChange: Updates the selected primary table and resets the reference table when a primary checkbox is selected or deselected.
*  handleReferenceCheckboxChange: Updates the selected reference table when a reference checkbox is selected or deselected.
*  handleGetFirestoreSchema: Fetches the schema of the selected Firestore collection and handles loading and error states.
*  fetchOrdersData: Fetches order data and schema from a Firestore endpoint and stores the data in state and sessionStorage.
*  fetchCloudSqlSchema: Fetches the schema data from a Cloud SQL database for the selected table and stores the data in state and sessionStorage.
*  handleGenerateSchema: Generates a schema for BigQuery using a provided project ID, dataset ID, and table ID, and handles loading and error states.
*  handleDataMaskingCheckboxChange: Toggles the masking of a specific field in the schema data and stores the updated list of masked columns in sessionStorage.
*  handleDataRedundancyCheckboxChange: Toggles the redundancy of a specific field in the schema data and stores the updated list of redundant columns in sessionStorage.
*  handleCloudSqlMaskingCheckboxChange: Toggles the masking of a specific field in the Cloud SQL primary schema and stores the updated list of masked 
   columns in sessionStorage.
*  handleCloudSqlRedundancyCheckboxChange: Toggles the redundancy of a specific field in the Cloud SQL primary schema and stores the updated list 
   of redundant columns in sessionStorage.
*  handleCloudSqlMaskCheckboxChange: Toggles the masking of a specific field in the Cloud SQL reference schema and stores the updated list of masked 
   columns in sessionStorage.
*  handleCloudSqlRedundantCheckboxChange: Toggles the redundancy of a specific field in the Cloud SQL reference schema and stores the updated list of redundant 
   columns in sessionStorage.
*  handleJsonDataMaskingCheckboxChange: Toggles the masking of a specific field in the JSON schema data and stores the updated list of masked columns in 
   sessionStorage and local state.
*  handleJsonDataRedundancyCheckboxChange: Toggles the redundancy of a specific field in the JSON schema data and stores the updated list of redundant
   columns in sessionStorage and local state.
*
*/
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { getTables } from "../../../Store/Thunk/Btaas/testData";
import { Typography } from "@mui/material";
import { InfoOutlined } from '@mui/icons-material';
import {
  clearTableList,
  setDbType,
  // setDataStoreCred,
  setGenericDbCred,
} from "../../../Store/Action/Btaas/testDataSlice";
// import Loader from "../../../Utils/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Checkbox, FormControlLabel, Grid, Card, CardContent
} from "@mui/material";
import RestoreIcon from '@mui/icons-material/Restore';
export default function GetTables() {
  const { dbType} = useSelector(
    (state) => state.btaasTestData
  );

  // const [file, setFile] = useState(null);
  // const [numRows, setNumRows] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [initialData, setInitialData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [schemaData, setSchemaData] = useState([]);
  const [sensitiveFields,setSensitiveFields] = useState([]);
  const [primarySensitiveFields, setPrimarySensitiveFields] = useState([]);
  const [referenceSensitiveFields, setReferenceSensitiveFields] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isDataVisible, setIsDataVisible] = useState(false);
  // const [selectedDataset, setSelectedDataset] = useState("btaastest");
  const [selectedTable, setSelectedTable] = useState(sessionStorage.getItem('selectedTable') || '');
  const [isLoading, setIsLoading] = useState(false);
  // const [redundantData, setRedundantData] = useState('no');
  const [referenceTables, setReferenceTables] = useState([]);
  const [selectedPrimaryTable, setSelectedPrimaryTable] = useState(null);
  const [selectedReferenceTable, setSelectedReferenceTable] = useState(null);
  const [primarySchemaData, setPrimarySchemaData] = useState([]);
  const [referenceSchemaData, setReferenceSchemaData] = useState([]);
  const [selectedPrimaryField, setSelectedPrimaryField] = useState(null);
  const [selectedReferenceField, setSelectedReferenceField] = useState(null); // Track selected reference table field
  const [isFieldsSelected, setIsFieldsSelected] = useState(false);
  const [storedPrimaryTable, setStoredPrimaryTable] = useState();
  const [fileSchema, setFileSchema] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [projectId, setprojectId] = useState("");
  const dispatch = useDispatch();


  useEffect(() => {
    setprojectId(sessionStorage.getItem("project_id"));  // Your project_id
    // sessionStorage.setItem("project_id", projectId);
    sessionStorage.setItem("redundancycolumns", "")
    sessionStorage.setItem("maskingcolumns", "")
    // sessionStorage.setItem("calculatedcolumns", "")
    setStoredPrimaryTable(sessionStorage.getItem("selectedPrimaryTable"));
    const storedReferenceTable = sessionStorage.getItem("selectedReferenceTable");
    const storedPrimaryField = sessionStorage.getItem("selectedPrimaryField");
    const storedReferenceField = sessionStorage.getItem("selectedReferenceField");
    setSensitiveFields(sessionStorage.getItem("Sensitive Fields"));
    if (storedPrimaryTable && storedPrimaryTable !== selectedTable) {
      setSelectedTable(storedPrimaryTable);
    }
    if (storedReferenceTable && storedReferenceTable !== selectedReferenceTable) {
      setSelectedReferenceTable(storedReferenceTable);
    }
    if (storedPrimaryField && storedPrimaryField !== selectedPrimaryField) {
      setSelectedPrimaryField(storedPrimaryField);
    }
    if (storedReferenceField && storedReferenceField !== selectedReferenceField) {
      setSelectedReferenceField(storedReferenceField);
    }
  }, []);
  useEffect(() => {
    const storedFileSchema = JSON.parse(sessionStorage.getItem("Primary Schema") || "[]");
    setSensitiveFields(sessionStorage.getItem("Primary Sensitive Fields"))
    setFileSchema(storedFileSchema);
  }, []);

  const getProjectId = () => {
    return sessionStorage.getItem("project_id");
  };
  const allTables = ["orders", "Customer"];
  useEffect(() => {
    if (selectedTable) {
      setReferenceTables(allTables.filter((table) => table !== selectedTable));
    }
  }, [selectedTable, allTables]);

  // Handle primary table selection and filter reference tables
  const handlePrimaryTableChange = (selected) => {
    // const selected = event.target.value;
    setSelectedTable(selected);
    setReferenceTables(allTables.filter((table) => table !== selected));
    sessionStorage.setItem("selectedPrimaryTable", selected);
    
    sessionStorage.removeItem("selectedPrimaryField"); // Reset previous field selection
    sessionStorage.removeItem("selectedReferenceTable");
    sessionStorage.removeItem("selectedReferenceField");
  };
  const handleReferenceTableChange = (selected) => {
    // const selected = event.target.value;
    setSelectedReferenceTable(selected);

    // Store reference table selection in session storage
    sessionStorage.setItem("selectedReferenceTable", selected);
    sessionStorage.removeItem("selectedReferenceField"); // Reset previous field selection
  };
  const handlePrimaryFieldChange = (field) => {
    if (selectedPrimaryField !== field) {
      setSelectedPrimaryField(field); // Select primary field
      sessionStorage.setItem("selectedPrimaryField", field);
      setPrimarySchemaData((prevSchemaData) => {
        const newSchemaData = prevSchemaData.map((item) => {
          if (item.Field === field) {
            return {
              ...item,
              dataRedundancy: true, // Mark as redundant
              isDisabled: true, // Disable the checkbox
            };
          }
          return item;
        });

        // Update redundancy columns in sessionStorage
        const selectedColumns = newSchemaData
          .filter((column) => column.dataRedundancy)
          .map((column) => column.Field);
        sessionStorage.setItem("redundancycolumns", selectedColumns.join(","));

        return newSchemaData;
      });
    }
  };

  const handleReferenceFieldChange = (field) => {
    if (selectedReferenceField !== field) {
      setSelectedReferenceField(field); // Select reference field
      sessionStorage.setItem("selectedReferenceField", field);
    }
  };
  // const storedPrimaryField = sessionStorage.getItem("selectedPrimaryField");
  // const storedReferenceField = sessionStorage.getItem("selectedReferenceField");
  // if (storedPrimaryField) {
  //   setSelectedPrimaryField(storedPrimaryField); // Set the selected primary field from sessionStorage
  // }

  // if (storedReferenceField) {
  //   setSelectedReferenceField(storedReferenceField); // Set the selected reference field from sessionStorage
  // }
  // Check if both fields are selected
  const handleCheckboxChange = (event) => {
    const value = event.target.name;
    if (event.target.checked) {
      setSelectedTable(value);
      sessionStorage.setItem("selectedTable", value);
    } else {
      setSelectedTable('');
      sessionStorage.removeItem("selectedTable");
    }
  };
  const handleFirestoreCheckboxChange = (event) => {
    const value = event.target.name;
    if (event.target.checked) {
      setSelectedCollection(value);  // Update selected collection (Firestore)
      sessionStorage.setItem("selectedCollection", value);
    } else {
      setSelectedCollection('');  // Reset the selected collection when unchecked
      sessionStorage.removeItem("selectedCollection");
    }
  };

  React.useEffect(() => {
    if (selectedPrimaryField && selectedReferenceField) {
      setIsFieldsSelected(true); // Disable all checkboxes when both fields are selected
    }
  }, [selectedPrimaryField, selectedReferenceField]);

  const resetSelections = () => {
    setSelectedPrimaryField(null);
    setSelectedReferenceField(null);
    setIsFieldsSelected(false);
    sessionStorage.removeItem("selectedPrimaryField");
    sessionStorage.removeItem("selectedReferenceField");
  };
  // sessionStorage.removeItem("selectedPrimaryField");
  // sessionStorage.removeItem("selectedReferenceField");
  useEffect(() => {
    if (selectedPrimaryField && selectedReferenceField) {
      setIsFieldsSelected(true);
    }
  }, [selectedPrimaryField, selectedReferenceField]);
  const handleSelectDb = async (event) => {
    const selectedValue = event.target.value;
    dispatch(setDbType(selectedValue));
    setSelectedCollection(""); // Reset collection when dbType changes
    setSelectedTable(""); // Reset table when dbType changes
    if (selectedValue === "Order") {
      await fetchOrdersData();
    }

  };
  const handlePrimaryCheckboxChange = (event, table) => {
    if (event.target.checked) {
      setSelectedPrimaryTable(table);
      setSelectedReferenceTable(''); // Reset reference table on primary table change
    } else {
      setSelectedPrimaryTable('');
    }
  };

  const handleReferenceCheckboxChange = (event, table) => {
    if (event.target.checked) {
      setSelectedReferenceTable(table);
    } else {
      setSelectedReferenceTable('');
    }
  };
  useEffect(() => {
    console.log("Selected Primary Table:", storedPrimaryTable);
    console.log("Reference Tables:", referenceTables);
  }, [storedPrimaryTable, referenceTables]);
  const handleSelectCollection = async (event) => {
    // setIsLoading(true);
    const collectionName = event.target.value;
    setSelectedCollection(collectionName); // Update selected collection
    setIsButtonEnabled(collectionName !== ""); // Enable button if collection is selected
    setIsDataVisible(false);

    if (collectionName === "Orders") {
      await fetchOrdersData();
      setIsLoading(false);
    }
  };
  const handleGetFirestoreSchema = async () => {
    if (!selectedCollection) return; // Ensure a collection is selected

    setIsLoading(true);
    setErrorMessage("");
    try {
      // Fetch schema data based on the selected collection
      await fetchOrdersData(selectedCollection);
      // setIsLoading(false);
      setIsDataVisible(true); // Show the data after button click
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchOrdersData = async () => {
    const projectId = getProjectId();
    const collectionName = "Orders";
    try {
      const response = await fetch(

        `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/testmasking/firestore-data?project_id=${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_id: projectId,
            collection_name: collectionName,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Data:", data);
        setOrdersData(data.sample_data || []);
        setSchemaData(data.schema || []);
        const sensitiveFieldsSet = new Set(
          data.sensitive_fields.map((field) => field.field_name)
        );
        setSensitiveFields(sensitiveFieldsSet);
        sessionStorage.setItem("Primary Schema", JSON.stringify(data.schema))
        // Store the schema data
      } else {
        console.error("Failed to fetch data:", response.statusText);
        setErrorMessage("Missing project_id or collection_name. Please enter the Project Id in the previous step");
        setOrdersData([]);
        setSchemaData([]);
      }
    }
    catch (error) {
      setErrorMessage("Missing project_id or collection_name");
    }
  };
  const handleFieldCheckboxChange = (index, key) => {
    const updatedSchema = [...schemaData];
    updatedSchema[index][key] = !updatedSchema[index][key];
    setSchemaData(updatedSchema);
  };
  const fetchCloudSqlSchema = async (tableName, isPrimary = true) => {
    setErrorMessage(""); // Clear any previous error messages
    setIsLoading(true);
    const projectId = getProjectId();
    const location = "us-central1";
    const instanceName = "sdg";
    const dbUser = process.env.REACT_APP_DB_USER;
    const dbPass = process.env.REACT_APP_DB_PASS;
    const dbName = "sdg";
    // const tableName = selectedTable;
    if (!dbUser || !dbPass) {
      console.error("DB user or password is not defined.");
      setErrorMessage("Missing required parameters: DB user or password");
      setIsLoading(false);
      return;
    }
    const url = `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/testmasking/cloud-sql-table-schema?project_id=${projectId}`;

    const requestBody = {
      project_id: getProjectId(),
      location: location,
      instance_name: instanceName,
      db_user: dbUser,
      db_pass: dbPass,
      db_name: dbName,
      table_name: tableName,
    };

    try {
      // setIsLoading(true);
      console.log('Request Body:', JSON.stringify(requestBody));
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Cloud SQL Schema Data:", data);
        if (data.schema && data.initial_data) {
          if (isPrimary) {
            setPrimarySchemaData(data.schema);
            setPrimarySensitiveFields(data.sensitive_fields.map((field) => field.field_name));
            sessionStorage.setItem("Primary Schema", JSON.stringify(data.schema))
            sessionStorage.setItem("Primary Sensitive Fields",JSON.stringify(data.sensitive_fields.map((field) => field.field_name)))
            // setSensitiveFields(primarycolumns)
            // console.log("pri cols",sensitiveFields)
          } else {
            setReferenceSchemaData(data.schema);
            setReferenceSensitiveFields(data.sensitive_fields.map((field) => field.field_name));
            sessionStorage.setItem("Reference Schema", JSON.stringify(data.schema))
            sessionStorage.setItem("Reference Sensitive Fields",JSON.stringify(data.sensitive_fields.map((field) => field.field_name)))
            const referencecolumns= sessionStorage.getItem("Reference Sensitive Fields")
            // setSensitiveFields(referencecolumns)
            // console.log("reference cols",sensitiveFields)
          }
        } else {
          console.error("Response missing required fields (schema or initial_data).");
          setErrorMessage('Response missing required fields (schema or initial_data)');
          isPrimary ? setPrimarySchemaData([]) : setReferenceSchemaData([]);
        }
      } else {
        // const errorText = await response.text();
        // console.error("Failed to fetch Cloud SQL schema:", response.statusText);
        setErrorMessage("Missing required parameters. Please enter the fields in the previous step.");
        isPrimary ? setPrimarySchemaData([]) : setReferenceSchemaData([]);
      }
    } catch (error) {
      console.error("Error fetching Cloud SQL schema:", error);
      setErrorMessage('"Missing required parameters. Please enter the fields in the previous step." ');
      isPrimary ? setPrimarySchemaData([]) : setReferenceSchemaData([]);
    } finally {
      setIsLoading(false); // End loading
    }
  };


  const handleGenerateSchema = async () => {
    setErrorMessage(""); // Clear any previous error messages
    setIsLoading(true);
    // Add logic to generate the schema for BigQuery
    console.log("Generating schema for BigQuery...");
    const projectId = getProjectId();
    const datasetId = "btaastest";
    const tableId = selectedTable;
    // const location = "us-central1";
    if (!datasetId || !tableId) {
      console.error("Missing dataset_id or table_id");
      setErrorMessage("Missing dataset_id or table_id");
      setIsLoading(false);
      return;
    }

    console.log("Fetching schema with projectId:", projectId, "datasetId:", datasetId, "tableId:", tableId);

    const url = `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/testmasking/table-schema?project_id=${projectId}&dataset_id=${datasetId}&table_id=${tableId}`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        console.log("Schema Data:", data);
        const schema = data.schema || [];
        const sensitiveFields = data.sensitive_fields || [];
        setSchemaData(schema);
        setSensitiveFields(sensitiveFields);
        sessionStorage.setItem("Primary Schema", JSON.stringify(data.schema))
        // Assuming the schema fields are in `fields`
      } else {
        
        console.error("Failed to fetch schema:", response.statusText);

        setSchemaData([]);
      }
    } catch (error) {
      console.error("Error fetching schema:", error);
      setErrorMessage("Missing project_id or dataset_id. Please enter the required fields in previous step.");
      setSchemaData([]);
    } finally {
      setIsLoading(false);
    }
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
  const handleGenerate = async (event) => {
    setSelectedTable(event.target.value)
    sessionStorage.setItem("selectedTable", event.target.value);
  }


  const handleDataMaskingCheckboxChange = (index, fieldName) => {
    // const maskableFields = ["birthDate", "cardNumber", "emailAddress", "phoneNumber"];
    // if (!maskableFields.includes(fieldName)) {
    //   return; // Exit the function if the field should not be masked
    // }
    setSchemaData((prevSchemaData) => {
      const newSchemaData = [...prevSchemaData];


      newSchemaData[index] = {
        ...newSchemaData[index],
        [fieldName]: !newSchemaData[index][fieldName],
      };


      const selectedColumns = newSchemaData
        .filter((column) => column[fieldName])
        .map((column) => column.name);
      const maskcolumn = selectedColumns.length > 0 ? selectedColumns.join(",") : ""
      sessionStorage.setItem("maskingcolumns", maskcolumn);
      // sessionStorage.setItem("maskingcolumns", selectedColumns.join(","));

      return newSchemaData;
    });
  };

  // const allowedDataRedundancyFields = {
  //   firestore: {
  //     order: ["customerID", "orderID"]
  //   },
  //   bigquery: {
  //     patient: ["patientID", "phoneNumber"],
  //     orders: ["customerid", "orderid", "trackingnumber"]
  //   }
  // };

  const handleDataRedundancyCheckboxChange = (index, fieldName) => {
    setSchemaData((prevSchemaData) => {
      const newSchemaData = [...prevSchemaData];
      newSchemaData[index] = {
        ...newSchemaData[index],
        [fieldName]: !newSchemaData[index][fieldName],
      };
      const selectedColumns = newSchemaData
        .filter((column) => column[fieldName])
        .map((column) => column.name);
      const redundantcolumn = selectedColumns.length > 0 ? selectedColumns.join(",") : ""
      sessionStorage.setItem("redundancycolumns", redundantcolumn);

      return newSchemaData;
    });
  };
  // Primary Schema CloudSQL Checkbox
  const handleCloudSqlMaskingCheckboxChange = (field, fieldName) => {
    setPrimarySchemaData((prevSchemaData) => {
      const newSchemaData = [...prevSchemaData];
      const index = newSchemaData.findIndex(item => item.Field === field.Field);

      if (index !== -1) {
        newSchemaData[index] = {
          ...newSchemaData[index],
          [fieldName]: !newSchemaData[index][fieldName],
        };
      }
      const selectedColumns = newSchemaData
        .filter((column) => column[fieldName])
        .map((column) => column.Field);
      const maskcolumn = selectedColumns.length > 0 ? selectedColumns.join(",") : "";
      sessionStorage.setItem("maskingcolumns", maskcolumn);

      return newSchemaData;
    });
  };

  const handleCloudSqlRedundancyCheckboxChange = (field, fieldName) => {
    setPrimarySchemaData((prevSchemaData) => {
      const newSchemaData = prevSchemaData.map((item) => {
        if (item.Field === field.Field && !item.isDisabled) {
          return {
            ...item,
            [fieldName]: !item[fieldName],
          };
        }
        return item;
      });

      const selectedColumns = newSchemaData
        .filter((column) => column[fieldName])
        .map((column) => column.Field);
      const redundantcolumn = selectedColumns.length > 0 ? selectedColumns.join(",") : "";
      sessionStorage.setItem("redundancycolumns", redundantcolumn);

      return newSchemaData;
    });
  };

  //Reference Schema CloudSql Checkbox
  const handleCloudSqlMaskCheckboxChange = (field, fieldName) => {
    setReferenceSchemaData((prevSchemaData) => {
      const newSchemaData = [...prevSchemaData];
      const index = newSchemaData.findIndex(item => item.Field === field.Field);

      if (index !== -1) {
        newSchemaData[index] = {
          ...newSchemaData[index],
          [fieldName]: !newSchemaData[index][fieldName],
        };
      }
      const selectedColumns = newSchemaData
        .filter((column) => column[fieldName])
        .map((column) => column.Field);
      const maskcolumn = selectedColumns.length > 0 ? selectedColumns.join(",") : "";
      sessionStorage.setItem("maskedcolumns", maskcolumn);

      return newSchemaData;
    });
  };

  const handleCloudSqlRedundantCheckboxChange = (field, fieldName) => {
    setReferenceSchemaData((prevSchemaData) => {
      const newSchemaData = [...prevSchemaData];
      const index = newSchemaData.findIndex(item => item.Field === field.Field);

      if (index !== -1) {
        newSchemaData[index] = {
          ...newSchemaData[index],
          [fieldName]: !newSchemaData[index][fieldName],
        };
      }
      const selectedColumns = newSchemaData
        .filter((column) => column[fieldName])
        .map((column) => column.Field);
      const redundantcolumn = selectedColumns.length > 0 ? selectedColumns.join(",") : "";
      sessionStorage.setItem("redundantcolumns", redundantcolumn);

      return newSchemaData;
    });
  };
  const handleJsonDataMaskingCheckboxChange = (index, fieldName) => {
    const newFileSchema = [...fileSchema];
    newFileSchema[index] = {
      ...newFileSchema[index],
      [fieldName]: !newFileSchema[index][fieldName],
    };
    const selectedColumns = newFileSchema
      .filter((column) => column[fieldName]) 
      .map((column) => column.name); 
    const maskcolumn = selectedColumns.length > 0 ? selectedColumns.join(",") : "";
    sessionStorage.setItem("maskingcolumns", maskcolumn);
    setFileSchema(newFileSchema);
    sessionStorage.setItem("Primary Schema", JSON.stringify(newFileSchema));
    
  };
  const handleJsonDataRedundancyCheckboxChange = (index, fieldName) => {
    const newFileSchema = [...fileSchema];
    newFileSchema[index] = {
      ...newFileSchema[index],
      [fieldName]: !newFileSchema[index][fieldName],
    };
    const selectedColumns = newFileSchema
      .filter((column) => column[fieldName]) 
      .map((column) => column.name); 
    const redundantcolumn = selectedColumns.length > 0 ? selectedColumns.join(",") : "";
    sessionStorage.setItem("redundancycolumns", redundantcolumn);
    setFileSchema(newFileSchema);
    sessionStorage.setItem("Primary Schema", JSON.stringify(newFileSchema));
  };



  // const handleCalculatedFieldCheckboxChange = (index, fieldName) => {
  //   setSchemaData((prevSchemaData) => {
  //     const newSchemaData = [...prevSchemaData];


  //     newSchemaData[index] = {
  //       ...newSchemaData[index],
  //       [fieldName]: !newSchemaData[index][fieldName],
  //     };


  //     const selectedColumns = newSchemaData
  //       .filter((column) => column[fieldName])
  //       .map((column) => column.name);
  //     // sessionStorage.setItem("calculatedcolumns", selectedColumns.join(","));
  //     const calculatecolumn = selectedColumns.length > 0 ? selectedColumns.join(",") : ""
  //     sessionStorage.setItem("calculatedcolumns", calculatecolumn);

  //     return newSchemaData;
  //   });
  // };

  return (
    <Box sx={{ minWidth: 150 }}>
      <div className="row">
        <div className="col-md-3">
          <FormControl sx={{ m: 1, minWidth: 140 }}>
            <InputLabel id="demo-simple-select-label" sx={{
              backgroundColor: 'white',
              padding: '0 4px',
              transform: 'translate(-px, -5px) scale(1)',
            }}>Source Systems</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dbType}
              label="DB Type"
              onChange={handleSelectDb}
              disabled // Disable the select component
            >
              <MenuItem value="Firestore">Firestore</MenuItem>
              <MenuItem value="BigQuery">BigQuery</MenuItem>
              <MenuItem value="CloudSql">CloudSql</MenuItem>
              <MenuItem value="JSON/CSV">JSON/CSV</MenuItem>
            </Select>
          </FormControl>
        </div>
        {dbType === "Firestore" && (
          <>
            {/* Card container for checkboxes */}
            <Card sx={{ maxWidth: 300, padding: 1.5 }}>
              <CardContent>
                <Typography variant="h6">Select your Collection</Typography>
                <Grid container spacing={2} alignItems="center">
                  {/* Orders checkbox */}
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedCollection === "Orders"}
                          onChange={handleFirestoreCheckboxChange}
                          name="Orders"
                          color="primary"
                        />
                      }
                      label="Orders"
                    />
                  </Grid>

                  {/* Customer Order checkbox */}
                  {/* <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedCollection === "Customer Order"}
                          onChange={handleFirestoreCheckboxChange}
                          name="Customer Order"
                          color="primary"
                        />
                      }
                      label="Customer Order"
                    />
                  </Grid> */}

                  {/* MCD Store checkbox */}
                  {/* <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedCollection === "MCD Store"}
                          onChange={handleFirestoreCheckboxChange}
                          name="MCD Store"
                          color="primary"
                        />
                      }
                      label="MCD Store"
                    />
                  </Grid> */}
                </Grid>

                {/* Get Firestore Schema Button */}

                <Button

                  variant="contained"
                  color="primary"
                  onClick={handleGetFirestoreSchema}
                  disabled={!selectedCollection || isLoading}
                  sx={{
                    marginTop: 2, display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  Get Firestore Schema
                </Button>
              </CardContent>
            </Card>
            <Typography color="error" align="center" style={{ marginTop: "20px" }}>{errorMessage}</Typography>
          </>
        )}
        
        {(dbType === "JSON/CSV") && (
          <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              File Schema
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <InfoOutlined sx={{ marginRight: 1, color: 'info.main' }} />
            <Typography variant="body2">
            Sensitive fields are detected using the DLP (Data Loss Prevention) Mechanism.
            </Typography>
          </Box>
            <TableContainer component={Paper} >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Field Name</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Sensitive Fields</Typography></TableCell>
                    <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Unique Fields</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fileSchema.map((field, index) => {
                    
                    const fieldName = field.name.toLowerCase();
                    const sensitiveFields = JSON.parse(sessionStorage.getItem("Sensitive Fields")) || [];
                    const isSensitiveField = sensitiveFields.includes(field.name);
                    // const isSensitiveField = /birthdate|birth date|dob|dateofbirth|birth_date|dob_|emailaddress|email address|email|mail|phonenumber|phno|phone|contact|mobileno|cell|cardnumber|creditcard|debitcard|card_number|ccn/i.test(fieldName);
                    // const isUniqueField = /id|user_id|userid|user_id_|phonenumber|phno|phone|mobileno|contact_number|trackingnumber|tracking_no|tracking_num|tracking_id|patientid|patient_id|patient_id_/i.test(fieldName);
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</TableCell>
                        <TableCell>{field.type}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={field.dataMasking || false}
                            onChange={() => handleJsonDataMaskingCheckboxChange(index, 'dataMasking')}
                            disabled={!isSensitiveField} 
                            //  disabled={!field.isSensitive} 
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={field.dataRedundancy || false}
                            onChange={() => handleJsonDataRedundancyCheckboxChange(index, 'dataRedundancy')}
                            // disabled={!isUniqueField} 
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

              </Table>
            </TableContainer>
          </Box>
        )}

        {dbType === "BigQuery" && (
          <div className="col-md-6" style={{ display: 'flex', alignItems: 'center' }}>
            {/* Card container for checkboxes */}
            <Card sx={{ maxWidth: 400, padding: 1.5, minHeight: 20 }}>
              <CardContent>
                <Typography variant="h6">Select your Collections</Typography>
                <Grid container spacing={2}>
                  {/* Order checkbox */}
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedTable === "order"}
                          onChange={handleCheckboxChange}
                          name="order"
                          color="primary"
                        />
                      }
                      label="Order"
                    />
                  </Grid>

                  {/* Patients checkbox */}
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedTable === "patients"}
                          onChange={handleCheckboxChange}
                          name="patients"
                          color="primary"
                        />
                      }
                      label="Patients"
                    />
                  </Grid>
                </Grid>


                {/* Get Schema Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateSchema}
                  disabled={!selectedTable || ordersData.length > 0} // Button enabled only when a table is selected
                  sx={{ ml: 2, mt: 2 }} // Margin-left and margin-top for spacing
                >
                  Get BigQuery Schema
                </Button>
              </CardContent>
              <Typography color="error" align="center" style={{ marginTop: "20px" }}>{errorMessage}</Typography>
            </Card>

          </div>
        )}
        {dbType === "CloudSql" && (
          <>
            <div className="col-md-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', alignItems: 'flex-start', marginRight: "5%" }}>
              <Card sx={{ maxWidth: 300, padding: 1.5, minHeight: 20 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Select your Primary Table</Typography>
                  <FormControl sx={{ m: 1, minWidth: 190 }}>
                    <Grid container spacing={2}>
                      {allTables
                        .filter((table) => table === "Customer")
                        .map((table) => (
                          <Grid item xs={6} key={table}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedTable === table}
                                  onChange={() => handlePrimaryTableChange(table)}
                                  name={table}
                                  color="primary"
                                />
                              }
                              label={table.toUpperCase()}
                            />
                          </Grid>
                        ))}
                    </Grid>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => fetchCloudSqlSchema(selectedTable, true)}
                    disabled={!selectedTable || primarySchemaData.length > 0}
                    sx={{ ml: 2, width: 'auto', minWidth: '170px' }}
                  >
                    Get Primary Table Schema
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="col-md-3">
              {selectedTable && (
                <Card sx={{ maxWidth: 300, padding: 1.5, minHeight: 20, marginRight: '20px' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Select Reference Table</Typography>
                    <FormControl sx={{ m: 1, minWidth: 190, width: '100%' }}>
                      <Grid container spacing={2}>
                        {referenceTables.map((table) => (
                          <Grid item xs={6} key={table}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedReferenceTable === table}
                                  onChange={() => handleReferenceTableChange(table)}
                                  name={table}
                                  color="primary"
                                />
                              }
                              label={table.toUpperCase()}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormControl>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => fetchCloudSqlSchema(selectedReferenceTable, false)} // Assuming a reference table is selected
                      disabled={!selectedReferenceTable || referenceSchemaData.length > 0}
                      sx={{ ml: 2, width: 'auto', minWidth: '170px' }}
                    >
                      Get Reference Table Schema
                    </Button>
                  </CardContent>

                </Card>

              )}
              <Typography color="error" align="center" style={{ marginTop: "20px" }}>{errorMessage}</Typography>
            </div>
          </>
        )}


        {/* Button to fetch reference table schema */}

        {/* <Typography variant="h6" sx={{ mt: 2 }}>Initial Data</Typography> */}
        {/* {schemaData.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>Schema</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Field</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Null</strong></TableCell>
                <TableCell><strong>Key</strong></TableCell>
                <TableCell><strong>Default</strong></TableCell>
                <TableCell><strong>Extra</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schemaData.map((field) => (
                <TableRow key={field.Field}>
                  <TableCell>{field.Field}</TableCell>
                  <TableCell>{field.Type}</TableCell>
                  <TableCell>{field.Null}</TableCell>
                  <TableCell>{field.Key}</TableCell>
                  <TableCell>{field.Default}</TableCell>
                  <TableCell>{field.Extra}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )} */}

        {/* Render initial data if it exists */}
        {/* {initialData.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>Initial Data</Typography>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(initialData[0]).map((key) => (
                  <TableCell key={key}><strong>{key}</strong></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {initialData.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, idx) => (
                    <TableCell key={idx}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )} */}


        <div className="col-md-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {isLoading && <CircularProgress />}
          {/* Sample Data Table */}
          {dbType === "Firestore" && !isLoading && ordersData.length > 0 && (
            <Box mt={2} sx={{ width: '100%', maxWidth: '1100px' }}>
            </Box>
          )}
          {dbType === "Firestore" && !isLoading && schemaData.length > 0 && (
            <Box mt={0.2}>
              <Typography variant="h6">Schema: Orders</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <InfoOutlined sx={{ marginRight: 1, color: 'info.main' }} />
            <Typography variant="body2">
            Sensitive fields are detected using the DLP (Data Loss Prevention) Mechanism.
            </Typography>
          </Box>
              <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography variant="subtitle1" fontWeight="bold">Field Name</Typography></TableCell>
                      <TableCell><Typography variant="subtitle1" fontWeight="bold">Type</Typography></TableCell>
                      <TableCell><Typography variant="subtitle1" fontWeight="bold">Mode</Typography></TableCell>
                      <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Sensitive Fields</Typography></TableCell>
                      <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Unique Fields</Typography></TableCell>
                      {/* <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Reference Fields</Typography></TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schemaData.map((field, index) => (
                      <TableRow key={index}>
                        <TableCell>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</TableCell>
                        <TableCell>{field.type}</TableCell>
                        <TableCell>{field.mode}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={field.dataMasking || false}
                            onChange={() => handleDataMaskingCheckboxChange(index, 'dataMasking')}
                            disabled={!sensitiveFields.has(field.name)}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={field.dataRedundancy || false}
                            onChange={() => handleDataRedundancyCheckboxChange(index, 'dataRedundancy')}
                            // disabled={!['orderid', 'customerid', 'customerID', 'orderID', 'trackingnumber', 'phoneNumber', 'patientID'].includes(field.name)}
                          />
                        </TableCell>
                        {/* <TableCell>
                          <Checkbox
                            checked={field.calculatedField || false}
                            onChange={() => handleCalculatedFieldCheckboxChange(index, 'calculatedField')}
                          />
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}


          {/* Schema Table */}
          {dbType === "BigQuery" && !isLoading && schemaData.length > 0 && (
            <Box mt={4} sx={{ width: '100%', maxWidth: '900px' }} >
              <Typography variant="h6">Schema Information: {selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <InfoOutlined sx={{ marginRight: 1, color: 'info.main' }} />
            <Typography variant="body2">
            Sensitive fields are detected using the DLP (Data Loss Prevention) Mechanism.
            </Typography>
          </Box>
              <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Name</Typography></TableCell>
                      <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Type</Typography></TableCell>
                      <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Mode</Typography></TableCell>
                      <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Sensitive Fields</Typography></TableCell>
                      <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Unique Fields</Typography></TableCell>
                      {/* <TableCell sx={{ padding: '8px' }}><Typography variant="subtitle1" fontWeight="bold">Reference Fields</Typography></TableCell> */}

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schemaData.map((field, index) => {
                      const isSensitiveField = sensitiveFields.some(sensitiveField => sensitiveField.field_name === field.name);
                      return (
                      <TableRow key={index}>
                        <TableCell sx={{ padding: '8px' }}>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</TableCell>
                        <TableCell sx={{ padding: '8px' }}>{field.type}</TableCell>
                        <TableCell sx={{ padding: '8px' }}>{field.mode}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={field.dataMasking || false}
                            onChange={() => handleDataMaskingCheckboxChange(index, 'dataMasking')}
                            disabled={!isSensitiveField}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={field.dataRedundancy || false}
                            onChange={() => handleDataRedundancyCheckboxChange(index, 'dataRedundancy')}
                            // disabled={!['orderid', 'customerid', 'trackingnumber', 'phoneNumber', 'patientID'].includes(field.name)}
                          />
                        </TableCell>
                        {/* <TableCell>
                          <Checkbox
                            checked={field.calculatedField || false}
                            onChange={() => handleCalculatedFieldCheckboxChange(index, 'calculatedField')}
                          />
                        </TableCell> */}


                      </TableRow>
                    );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          {/* Render initial data if it exists */}
          {/* {dbType === "CloudSql" && initialData.length > 0 && (
         <Box mt={4} sx={{ width: '100%', maxWidth: '1100px' }}>
          <Typography variant="h6" sx={{ mt: 3 }}>Initial Data</Typography>
          <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(initialData[0]).map((key) => (
                  <TableCell key={key}><strong>{key}</strong></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {initialData.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, idx) => (
                    <TableCell key={idx}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
    </Box>
      )} */}
      {/* {const sensitiveFields = primarySchemaData.sensitive_fields.map((field) => field.field_name);} */}
          {/* Display Primary Table Schema */}
          
          {dbType === "CloudSql" && !isLoading && primarySchemaData.length > 0 && (
            <Box mt={0.2} sx={{ width: '100%', maxWidth: '1100px' }}>
              <Typography variant="h6" sx={{ mt: 3 }}>Primary Table Schema: Customer</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <InfoOutlined sx={{ marginRight: 1, color: 'info.main' }} />
            <Typography variant="body2">
            Sensitive fields are detected using the DLP (Data Loss Prevention) Mechanism.
            </Typography>
           
          </Box>
              <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Field</strong></TableCell>
                      <TableCell><strong>Type</strong></TableCell>
                      <TableCell><strong>Null</strong></TableCell>
                      <TableCell><strong>Key</strong></TableCell>
                      {/* <TableCell><strong>Default</strong></TableCell> */}
                      <TableCell><strong>Extra</strong></TableCell>
                      <TableCell><strong>Primary Key</strong>

                        <RestoreIcon
                          sx={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                          onClick={resetSelections}
                        />
                      </TableCell>
                      <TableCell><strong>Sensitive Fields</strong></TableCell>
                      <TableCell><strong>Unique Fields</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {primarySchemaData.map((field, index) => (
                      <TableRow key={index}>

                        <TableCell>{field.Field.charAt(0).toUpperCase() + field.Field.slice(1)}</TableCell>
                        <TableCell>{field.Type}</TableCell>
                        <TableCell>{field.Null}</TableCell>
                        <TableCell>{field.Key || "N/A"}</TableCell>
                        {/* <TableCell>{field.Default}</TableCell> */}
                        <TableCell>{field.Extra || "N/A"}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedPrimaryField === field.Field}
                            onChange={() => handlePrimaryFieldChange(field.Field)}
                            disabled={isFieldsSelected || selectedPrimaryField === field.Field} // Disable all checkboxes once both fields are selected
                            
                          />
                        </TableCell>
                        <TableCell>
                {primarySensitiveFields.includes(field.Field) ? (
                  <Checkbox
                    checked={field.dataMasking || false}
                    onChange={() => handleCloudSqlMaskingCheckboxChange(field, "dataMasking")}
                  />
                ) : (
                  <Checkbox disabled />
                )}
              </TableCell>

                        <TableCell>
                            <Checkbox
                              checked={field.dataRedundancy || false}
                              onChange={() => handleCloudSqlRedundancyCheckboxChange(field, 'dataRedundancy')}
                              disabled={field.isDisabled} 
                            />
                        </TableCell>


                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Display Reference Table Schema */}
          {dbType === "CloudSql" && !isLoading && referenceSchemaData.length > 0 && (
            <Box mt={2} sx={{ width: '100%', maxWidth: '1100px' }}>
              <Typography variant="h6" sx={{ mt: 3 }}>Reference Table Schema: Orders</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <InfoOutlined sx={{ marginRight: 1, color: 'info.main' }} />
            <Typography variant="body2">
            Sensitive fields are detected using the DLP (Data Loss Prevention) Mechanism.
            </Typography>
          </Box>
              <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Field</strong></TableCell>
                      <TableCell><strong>Type</strong></TableCell>
                      <TableCell><strong>Null</strong></TableCell>
                      <TableCell><strong>Key</strong></TableCell>
                      {/* <TableCell><strong>Default</strong></TableCell> */}
                      <TableCell><strong>Extra</strong></TableCell>
                      <TableCell sx={{ alignItems: 'center' }}><strong style={{ whiteSpace: 'nowrap' }}>Reference Key</strong>
                        <RestoreIcon
                          sx={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                          onClick={resetSelections}
                        />
                      </TableCell>
                      <TableCell><strong>Sensitive Fields</strong></TableCell>
                      <TableCell><strong>Unique Fields</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {referenceSchemaData.map((field) => (
                      <TableRow key={field.Field}>

                        <TableCell>{field.Field.charAt(0).toUpperCase() + field.Field.slice(1)}</TableCell>
                        <TableCell>{field.Type}</TableCell>
                        <TableCell>{field.Null}</TableCell>
                        <TableCell>{field.Key === 'MUL' ? 'FK' : field.Key || "N/A"}</TableCell>
                        {/* <TableCell>{field.Default}</TableCell> */}
                        <TableCell sx={{
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          maxWidth: '160px',
                          textOverflow: 'ellipsis',
                        }}>{field.Extra || "N/A"}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedReferenceField === field.Field}
                            onChange={() => handleReferenceFieldChange(field.Field)}
                            disabled={isFieldsSelected || selectedReferenceField === field.Field} // Disable all checkboxes once both fields are selected
                          />
                        </TableCell>
                        <TableCell>
                        {referenceSensitiveFields.includes(field.Field) ? (
                           <Checkbox
                            checked={field.dataMasking || false}
                            disabled={["created_at", "updated_at"].includes(field.Field)}
                            onChange={() => handleCloudSqlMaskCheckboxChange(field, 'dataMasking')}
                            
                            />
                ) : (
                  <Checkbox disabled />
                )}
                        </TableCell>
                        <TableCell>
                          
                            <Checkbox
                              checked={field.dataRedundancy || false}
                              onChange={() => handleCloudSqlRedundantCheckboxChange(field, 'dataRedundancy')}
                            />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </div>
      </div>
    </Box>
  );
}
