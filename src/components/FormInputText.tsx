// src/form-component/FormInputText.tsx
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import TextField from "@mui/material/TextField";
import React, { useEffect } from 'react';
import {Box, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useState } from "react";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from "dayjs";
import 'dayjs/locale/es';
dayjs.locale('es');



interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  rules?: any;
  externalOnChange?: (value: string) => void;
  disabled?: boolean;
  type?: string;
  max?: number;
}

export const FormInputText = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  externalOnChange,
  disabled,
  type = "text",
  max,
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...rules,
        maxLength: max
          ? { value: max, message: `Máximo ${max} caracteres` }
          : undefined,
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          type={type}
          helperText={error?.message}
          size="small"
          error={!!error}
          value={field.value ?? ""}
          onChange={(e) => {
            field.onChange(e.target.value);
            externalOnChange?.(e.target.value);
          }}
          fullWidth
          label={label}
          disabled={disabled}
          inputProps={{ maxLength: max }}
        />
      )}
    />
  );
};

{/* Text Area */}
interface TextAreaProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  rules?: any;
  externalOnChange?: (value: string) => void;
  rows?: number;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const FormTextArea = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  externalOnChange,
  rows = 4,
  placeholder,
  fullWidth = true,
  disabled,
}: TextAreaProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          value={field.value ?? ""}
          label={label}
          variant="outlined"
          multiline
          rows={rows}
          placeholder={placeholder}
          fullWidth={fullWidth}
          disabled={disabled}
          error={!!error}
          helperText={error?.message} // 👈 SOLO RHF
          onChange={(e) => {
            field.onChange(e.target.value);
            externalOnChange?.(e.target.value);
          }}
        />
      )}
    />
  );
};

{/**Selectores */}

interface Option {
  label: string;
  value: number;
}

interface DropwdownProps<T extends FieldValues> {
  options: Option[];
  label: string;
  name: Path<T>;
  control: Control<T>;
  rules?: any;
  disabled?: boolean;
  defaultValue?: any;
  externalOnChange?: (value: string | number) => void; // 👈 AGREGAR
}

export const FormDropdown = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  options,
  disabled,
  defaultValue,
  externalOnChange,
}: DropwdownProps<T>) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ?? ''}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              {...field}
              value={field.value ?? ''}
              label={label}
              error={!!error}
              disabled={disabled}
              onChange={(e) => {
                const value = Number(e.target.value);
                field.onChange(value);
                externalOnChange?.(value); // 👈 AQUÍ
              }}
            >
              {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>

            {error && (
              <FormHelperText sx={{ color: "red" }}>
                {error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
};

//Form date

interface DateProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  rules?: any;
  disabled?: boolean;
}

export const FormDate = <T extends FieldValues>({
  label,
  name,
  control,
  rules,
  disabled,
}: DateProps<T>) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <DatePicker
              value={field.value ?? null}
              onChange={(date) => field.onChange(date)}
              label={label}
              disabled={disabled}
            />

            {error && (
              <FormHelperText sx={{ color: "red" }}>
                {error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </LocalizationProvider>
  );
};
{/** Input number */}

interface FormNumberProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  rules?: any;
  disabled?: boolean;
}

export const FormInputNumber = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  disabled,
}: FormNumberProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type="number"
          value={field.value ?? ""}
          helperText={error?.message}
          size="small"
          error={!!error}
          fullWidth
          label={label}
          disabled={disabled}
          onChange={(e) => {
            const value = e.target.value;
            field.onChange(value === "" ? "" : Number(value));
          }}
        />
      )}
    />
  );
};


{/** Image */}

interface FormImageProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

export const FormInputImage = <T extends FieldValues>({
  name,
  control,
}: FormImageProps<T>) => {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {

        // 👉 Determinar qué mostrar
        const currentPreview =
          preview ||
          (typeof field.value === "string" ? field.value : null);

        return (
          <Box>
            <IconButton component="label" sx={{ width: 100, height: 100 }}>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  field.onChange(file);

                  const url = URL.createObjectURL(file);
                  setPreview(url);
                }}
              />

              {currentPreview ? (
                <img
                  src={currentPreview}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <PhotoCameraIcon />
              )}
            </IconButton>

            {error && (
              <FormHelperText sx={{ color: "red" }}>
                {error.message}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
};