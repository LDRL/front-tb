// src/form-component/FormInputText.tsx
import { Controller, Control } from "react-hook-form";
import TextField from "@mui/material/TextField";
import React from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import classNames from 'classnames';
import classnames from 'classnames';

interface FormInputProps {
    name: string;
    control: Control<any>;
    label: string;
    rules?: any;
    externalOnChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const FormInputText = ({ name, control, label, rules, externalOnChange }: FormInputProps) => {
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
}

export const FormDropdown: React.FC<DropwdownProps> = ({
    name,
    control,
    label, 
    rules,
    options

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
                    >
                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                    </Select>
                    {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                    )}
                </>
            )}
        />
        </FormControl>
    )
}