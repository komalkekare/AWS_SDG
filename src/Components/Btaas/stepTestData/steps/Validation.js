/**
 * ValidateData Component
 * This component is responsible for fetching and displaying data validation summaries for synthetic and reference data from an external API. It showcases the 
   comparison between the synthetic data and the reference data based on various validation checks.
 * 
 * Features:
 * 
 * 1. **Fetching Validation Data:**
 *    - The component fetches validation data for both synthetic and reference data by making API calls to a server.
 *    - The data is fetched based on the project ID and database type (CloudSql or others).
 *    - The data is structured into statistics, success rates, and detailed validation results.
 * 
 * 2. **Displaying the Summary:**
 *    - The summary includes the overall success rate, total validations, and failed validations for both synthetic and reference data (if available).
 *    - A table displays detailed column validation results, including status (PASS/FAIL), unexpected counts, and percentages for each validation check.
 * 
 * 3. **UI Components:**
 *    - The `ColumnValidationTable` component displays detailed validation results in a tabular format.
 *    - It uses Material UI components such as `Table`, `Box`, `Typography`, and `Chip` for the layout.
 *    - Success and failure are highlighted with different colors (green for PASS and red for FAIL).
 * 
 * 4. **Error Handling and Loading States:**
 *    - The component displays a loading indicator while waiting for the validation data.
 *    - If there's an error in fetching the data (e.g., missing data or failed API requests),
 *      an error message is displayed to the user with an option to retry fetching the data.
 * 
 * 5. **Dependencies:**
 *    - React: For component-based structure and state management.
 *    - Material UI: For UI components like `Table`, `Typography`, `Chip`, etc.
 *    - Fetch API: To retrieve data from the server.
 * 
 * Functionalities:
 * - Handles loading and error states while fetching data.
 * - Displays validation data in a user-friendly format (table and summary cards).
 * - Provides side-by-side comparisons between synthetic and reference data validation results.
 * 
 */
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  // Button,
  Grid,
  Chip,
} from "@mui/material";
// import RefreshIcon from '@mui/icons-material/Refresh';

const ColumnValidationTable = ({ columnData, tableTitle }) => {
  // Group results by columns for side-by-side comparison
  const groupedResults = columnData.reduce((acc, result) => {
    acc[result.column] = acc[result.column] || [];
    acc[result.column].push(result);
    return acc;
  }, {});

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {tableTitle}
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Column</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Expectation Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Unexpected Count </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Unexpected Percent</TableCell>
              {/* <TableCell sx={{ fontWeight: "bold" }}>Observed Value</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedResults).map(([column, results]) =>
              results.map((result, idx) => (
                <TableRow
                  key={`${column}-${idx}`}
                  sx={{
                    backgroundColor: result.success
                      ? "rgba(200, 250, 205, 0.2)"
                      : "rgba(255, 200, 200, 0.2)",
                  }}
                >
                  {idx === 0 && (
                    <TableCell rowSpan={results.length} sx={{ fontWeight: "bold" }}>
                      <Typography variant="subtitle1">{column}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({results.filter((r) => r.success).length}/{results.length} passed)
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    {result.expectation_type.replace("expect_", "").replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={result.success ? "PASS" : "FAIL"}
                      color={result.success ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{result.result.unexpected_count ?? "0"}</TableCell>
                  <TableCell>
                    {result.result.unexpected_percent
                      ? `${result.result.unexpected_percent.toFixed(2)}%`
                      : "0%"}
                  </TableCell>
                  {/* <TableCell>{result.result.observed_value ?? "-"}</TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default function ValidateData() {
  const [validationData, setValidationData] = useState({
    synthetic: null,
    reference: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const getProjectId = () => {
    return sessionStorage.getItem("project_id");
  };

  const getDatabaseType = () => {
    return sessionStorage.getItem("dbType");
  };

  const fetchValidationData = async () => {
    setLoading(true);
    try {
      const projectId = getProjectId();
      const databaseType = getDatabaseType();
      const relationalSchema = JSON.parse(sessionStorage.getItem("Reference Schema"));
      const syntheticData = JSON.parse(sessionStorage.getItem("Generate Data"));
      const primarySchema = JSON.parse(sessionStorage.getItem("Primary Schema"));
      const primarysyntheticData = JSON.parse(sessionStorage.getItem("response message"));
      console.log("Project ID:", projectId);
      console.log("Database Type:", databaseType);
      console.log("Relational Schema:", relationalSchema);
      console.log("Synthetic Data:", syntheticData);
      console.log("Primary Schema:", primarySchema);
      console.log("Primary Synthetic Data:", primarysyntheticData);
      if (databaseType === "CloudSql") {
        // First API call for synthetic data
        const syntheticResponse = await fetch(
          `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/ctgan-summary?project_id=${projectId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              project_id: projectId,
              synthetic_data: primarysyntheticData,
              schema: primarySchema,
              
            }),
          }
        );

        if (!syntheticResponse.ok) {
          throw new Error(`Synthetic data HTTP error! status: ${syntheticResponse.status}`);
        }

        const syntheticResponseData = await syntheticResponse.json();
        
        // Second API call for reference data
        const referenceResponse = await fetch(
          `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/ctgan-summary?project_id=${projectId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              project_id: projectId,
              synthetic_data: syntheticData,
              schema: relationalSchema,
            }),
          }
        );

        if (!referenceResponse.ok) {
          throw new Error(`Reference data HTTP error! status: ${referenceResponse.status}`);
        }

        const referenceResponseData = await referenceResponse.json();

        // Update state with both synthetic and reference validation data
        setValidationData({
          synthetic: syntheticResponseData.ctgan_validation_summary,
          reference: referenceResponseData.ctgan_validation_summary
        });
      } else {
        // Existing API call for non-CloudSql databases
        const response = await fetch(
          `https://us-central1-brlcto-btaasgcp.cloudfunctions.net/geminigpt/ctgan-expectation-summary?project_id=${projectId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              project_id: projectId,
              synthetic_data: primarysyntheticData,
              schema: primarySchema,
              
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setValidationData({
          synthetic: data.ctgan_validation_summary,
          reference: null
        });
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching validation data:", err);
      setError("No generated data available. Please generate data in the previous step");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValidationData();
  }, []);

  const handleRefresh = (event) => {
    event.preventDefault();
    fetchValidationData();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Validating Generated Data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        {/* <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{ mt: 2 }}
        >
          Retry
        </Button> */}
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Data Validation Summary 
        </Typography>
      </Box>

      {/* Content */}
      {!validationData.synthetic ? (
        <Typography>No validation data available.</Typography>
      ) : (
        <>
          {/* Overall Summary Card for Synthetic Data */}
          <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Data Success Rate
                </Typography>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {validationData.synthetic.statistics.success_percent.toFixed(2)}%
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Validations
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {validationData.synthetic.statistics.evaluated_expectations}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Failed Validations
                </Typography>
                <Typography variant="h6" color="error.main" fontWeight="bold">
                  {validationData.synthetic.statistics.unsuccessful_expectations}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Synthetic Data Detailed Column Validations */}
          <ColumnValidationTable 
            columnData={validationData.synthetic.results} 
            tableTitle="Detailed Validations" 
          />

          {/* Reference Data Section (if available) */}
          {validationData.reference && (
            <>
              {/* Overall Summary Card for Reference Data */}
              <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Reference Data Success Rate
                    </Typography>
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      {validationData.reference.statistics.success_percent.toFixed(2)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Validations
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {validationData.reference.statistics.evaluated_expectations}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Failed Validations
                    </Typography>
                    <Typography variant="h6" color="error.main" fontWeight="bold">
                      {validationData.reference.statistics.unsuccessful_expectations}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Reference Data Detailed Column Validations */}
              <ColumnValidationTable 
                columnData={validationData.reference.results} 
                tableTitle="Reference Data Detailed Validations" 
              />
            </>
          )}
        </>
      )}
    </Box>
  );
}
