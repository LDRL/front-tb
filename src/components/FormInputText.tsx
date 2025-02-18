// src/form-component/FormInputText.tsx
import { Controller, Control } from "react-hook-form";
import TextField from "@mui/material/TextField";
import React from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from "dayjs";
import 'dayjs/locale/es';
dayjs.locale('es');

interface FormInputProps {
    name: string;
    control: Control<any>;
    label: string;
    rules?: any;
    externalOnChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    disabled?:boolean;
}

export const FormInputText = ({ name, control, label, rules, externalOnChange,disabled }: FormInputProps) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({
                field: { onChange, value = '' },
                fieldState: { error },
            }) => (
                <TextField
                    helperText={error ? error.message : null}
                    size="small"
                    error={!!error}
                    onChange={(e) => {
                        onChange(e);
                        if (externalOnChange) externalOnChange(e);
                    }}
                    value={value}
                    fullWidth
                    label={label}
                    variant="outlined"
                    sx={{
                        '& .MuiFormHelperText-root': {
                        color: 'red', // Puedes cambiar esto por el color que prefieras
                        },
                    }}
                    disabled={disabled}
                />
            )}
        />
    );
};

interface TextAreaProps {
  name: string;
  control: Control<any>;
  label: string;
  rules?: any;
  externalOnChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?:boolean;
}

export const FormTextArea: React.FC<TextAreaProps> = ({
  name,
  control,
  label,
  rules,
  externalOnChange,
  rows = 4,
  placeholder,
  fullWidth = true,
  disabled
}) => {
  return (
    
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({
            field: { onChange, value = '' },
            fieldState: { error },
        }) => (
            <TextField
                helperText={error ? error.message : null}
                size="small"
                error={!!error}
                onChange={(e) => {
                    onChange(e);
                    if (externalOnChange) externalOnChange(e);
                }}
                value={value}
                label={label}
                variant="outlined"
                multiline
                rows={rows}
                placeholder={placeholder}
                fullWidth={fullWidth}
                disabled={disabled}
            />
        )}
    />
  );
};

interface Option{
    label: string;
    value: number;
}

interface DropwdownProps {
    options: Option[],
    label: string;
    name: string;
    control: Control<any>;
    rules?: any;
    externalOnChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    disabled?:boolean;
}

export const FormDropdown: React.FC<DropwdownProps> = ({
    name,
    control,
    label, 
    rules,
    options, 
    externalOnChange,
    disabled

}) => {
    return (
        <FormControl variant="outlined" fullWidth >
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                defaultValue=""
                rules={rules}
                render={({
                    field,
                    fieldState : {error}
                }) => (
                    <>
                        <Select
                            labelId={`${name}-label`}
                            label={label}
                            {...field}
                            error={!!error}
                            onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value);

                                // Si existe una función externa, llamarla
                                if (externalOnChange) {
                                    externalOnChange(value);
                                }
                            }}
                            disabled={disabled}
                        >
                            {options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                        {error && (
                            <FormHelperText sx={{color: 'red'}}>{error.message}</FormHelperText>
                        )}
                    </>
                )}
            />
        </FormControl>
    )
}

//Form date

interface DateProps {
    label: string;
    name: string;
    control: Control<any>;
    rules?: any;
    disabled? : boolean;
}
export const FormDate: React.FC<DateProps> = ({
    label,
    name, 
    control, 
    rules,
    disabled

}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Controller
                name={name}
                control={control}
                defaultValue={null}
                rules={rules}
                render={({
                    field,
                    fieldState : {error}
                }) => (
                    <>
                        <DatePicker 
                            {...field} 
                            label={label}
                            onChange={(date) =>{
                                field.onChange(date);
                            }}
                            disabled={disabled}
                            // views={['day', 'month', 'year']}
                        />
                        {error && ( <FormHelperText sx={{color: 'red'}}>{error.message}</FormHelperText> )}
                    </>
                )}
            />

        </LocalizationProvider>
    )
}

interface FormNumberProps {
    name: string;
    control: Control<any>;
    label: string;
    rules?: any;
    externalOnChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    disabled?:boolean;
}

export const FormInputNumber = ({ name, control, label, rules, externalOnChange,disabled }: FormNumberProps) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({
                field: { onChange, value = '' },
                fieldState: { error },
            }) => (
                <TextField
                    helperText={error ? error.message : null}
                    size="small"
                    error={!!error}
                    onChange={(e) => {
                        onChange(e);
                        if (externalOnChange) externalOnChange(e);
                    }}
                    value={value}
                    fullWidth
                    label={label}
                    variant="outlined"
                    type="number"
                    disabled={disabled}
                />
            )}
        />
    );
};