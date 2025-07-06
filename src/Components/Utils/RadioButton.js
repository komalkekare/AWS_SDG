import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function RowRadioButtonsGroup(props) {

    const {heading, value, change, selectedValue} = props;
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label"><h3>{heading}</h3></FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={selectedValue}
        onChange={change}
      >
        {value.map((value, index) => (
        <FormControlLabel key={index} value={value} control={<Radio />} label={value} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
