/**
 * TestDataStepper Component
 * 
 * This component implements a stepper workflow for managing test data in a structured manner.
 * It guides the user through multiple steps, including:
 * 1. Configuring database connection details.
 * 2. Fetching tables and schema from the database.
 * 3. Generating synthetic data.
 * 4. Validating the generated data.
 * 5. Saving the final processed data.
 * 
 * Features:
 * - Uses Material UI Stepper for navigation.
 * - Manages form states and step transitions.
 * - Dispatches Redux actions to fetch and process data.
 * - Handles user input validation and step controls.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
// import StepButton from '@mui/material/StepButton';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
// Importing step components for each phase of the process
// import GetTables from './steps/GetTables';
import GenerateData from '../stepTestData/steps/GenerateData';
import Save from './steps/Save';
import ConfigurationDetails from './steps/ConfigurationDetails'; 
import Validation from './steps/Validation'; 
// Redux imports for state management
import { useDispatch, useSelector } from 'react-redux';
import StepLabel from "@mui/material/StepLabel";
import { clearTableList, setGenericDbCred } from '../../Store/Action/Btaas/testDataSlice';
// import { getTables } from '../../Store/Thunk/Btaas/testData';

export default function TestDataStepper() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // State management for step navigation and button control
  const [activeStep, setActiveStep] = useState(0);
  const [isDisabledNext, setisDisabledNext] = useState(true);
    // Retrieving necessary values from Redux store
  const { syntheticData, dbType, tableList } = useSelector((state) => state.btaasTestData);
  const [formValues, setFormValues] = useState({
    hostURL: '',
    dbName: '',
    username: '',
    password: '',
  });

  // Check if all required fields are filled
  const isFormValid = Object.values(formValues).every(value => value !== '');
    // Handles navigation to the next step
  const handleNext = () => {
    
    if (activeStep === 4) {
      
      setActiveStep(0);
    } else {
      setActiveStep(activeStep + 1);
      setisDisabledNext(true);
    }
  };
  // Handles form submission for database credentials and triggers table retrieval
  const handleGenericDbCred = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const genericDbCred = {
      db: dbType,
      hostURL: data.get('hostURL'),
      dbName: data.get('dbName'),
      username: data.get('username'),
      password: data.get('password')
    };
    dispatch(setGenericDbCred(genericDbCred));
    dispatch(clearTableList());
    // dispatch(getTables(genericDbCred));
  };
   // Handles navigation to the previous step
  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setisDisabledNext(false);
  };
   // Handles form input changes and enables/disables the "Next" button accordingly
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    // Enable "Next" button when all fields are filled
    setisDisabledNext(!isFormValid);
  };
   // Renders content dynamically based on the current step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <ConfigurationDetails />; 
      // case 1:
      //   return < GetTables/>;
      case 2:
        return <GenerateData />;
      case 3:
        return <Validation />; 
      case 4:
        return <Save />;
      default:
        return null;
    }
  };
    // Effect to enable or disable the "Next" button based on conditions
  useEffect(() => {
    if ((tableList && activeStep === 1) || (syntheticData && activeStep === 0)) {
      setisDisabledNext(true);
    } else {
      setisDisabledNext(false);
    }
  }, [tableList, syntheticData, activeStep]);

  return (
    <Box className="archGen" sx={{ width: "100%", padding: "3%" }}>
  {/* Stepper Component */}
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>Source Systems</StepLabel> 
        </Step>
        <Step>
          <StepLabel>Get Tables and Schema</StepLabel>
        </Step>
        <Step>
          <StepLabel>Generate Data</StepLabel>
        </Step>
        <Step>
          <StepLabel>Validation</StepLabel> 
        </Step>
        <Step>
          <StepLabel>Save</StepLabel>
        </Step>
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 5 ? (
          <Typography>All steps completed - you're finished!</Typography>
        ) : (
          <Box sx={{ mt: 3 }}>{renderStepContent(activeStep)}</Box>
        )}
         {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1, gap: 1, flexWrap: 'wrap' }}>
          <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mt: 2, mr: 1 }}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={isDisabledNext}
            onClick={handleNext}
            sx={{ mt: 2 }}
          >
            {activeStep === 4 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
