import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, Control } from "react-hook-form";


interface Option {
    label: string;
    value: number;
  }
interface FormInputProps {
    name: string;
    control: Control<any>;
    label: string;
    rules?: any;
    options: Option[]
}


export const FormInputDropdown: React.FC<FormInputProps> = ({
    name,
    control,
    label,
    rules,
    options
}) => {
    const generateSingleOptions = () => {
        return options.map((option: any) => {
            return (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            );
        });
    };

    return (
        <FormControl sx={{ mt: 2, minWidth: 200 }}>
            <InputLabel>{label}</InputLabel>
            <Controller
                render={({ field: { onChange, value } }) => (
                    <Select onChange={onChange} value={value}>
                        {generateSingleOptions()}
                    </Select>
                )}
                control={control}
                name={name}
            />
        </FormControl>
    );
};