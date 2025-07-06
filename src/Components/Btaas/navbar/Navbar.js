/*
 * @file Navbar.js
 * 
 * This component is responsible for rendering a tabbed interface where users 
 * can navigate between different sections, such as repository details and test data.
 * 
 * - It imports necessary dependencies, including React, Redux for state management, 
 *   Material-UI components for styling, and a stepper component (`TestDataStepper`).
 * 
 * - Uses `useSelector` from Redux to fetch the `repoToBeUsed` value, which represents 
 *   the repository selected by the user.
 * 
 * - Implements a tab structure (commented out) that can be extended to switch between 
 *   different sections like GitHub repository information and test data.
 * 
 * - Currently, the `TestDataStepper` component is displayed by default.
 * 
 * - Includes the `CustomTabPanel` component to manage tabbed content dynamically.
 * 
 * - Uses Material-UI's `Box` and `Typography` for layout and styling.
 * 
 * - Implements a `handleChange` function for tab switching, but the tab UI is 
 *   currently commented out.
 * 
 */
import * as React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import GitHub from "../github/GitHub";
import TestDataStepper from "../stepTestData/TestDataStepper";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
// Prop types validation for CustomTabPanel
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }
// BtaasTab component: Renders tabs and handles tab switching
export default function BtaasTab() {
  const [value, setValue] = React.useState(0);
    const {
       // Getting repo name from Redux state
      repoToBeUsed
    } = useSelector((state) => state.btaasGitLab);
  // Function to handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
       {/* Tab Navigation (Currently Commented Out) */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {/* <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label={repoToBeUsed.toUpperCase()} {...a11yProps(0)} />
          <Tab label="Test Data" {...a11yProps(1)} />
        </Tabs> */}
      </Box>
      {/* <CustomTabPanel value={value} index={0}>
        <GitHub />
      </CustomTabPanel> */}
      {/* <CustomTabPanel value={value} index={0}> */}
      
       {/* Displaying TestDataStepper by default */}
        <TestDataStepper />
      {/* </CustomTabPanel> */}
    </Box>
  );
}
