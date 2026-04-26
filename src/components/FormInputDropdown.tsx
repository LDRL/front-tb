import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";


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

//
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


{/*
// Selector con búsqueda
export interface FormAutocompleteAsyncProps<T extends FieldValues, TOption> {
  name: Path<T>;
  control: Control<T>;
  label: string;

  options: TOption[];
  loading?: boolean;

  getOptionLabel: (option: TOption) => string;

  // 🔥 IMPORTANTE: identidad SIEMPRE por value
  isOptionEqualToValue?: (option: TOption, value: TOption) => boolean;

  disabled?: boolean;
  onInputChange?: (value: string) => void;
  onChangeExternal?: (value: TOption | null) => void;
}

export const FormAutocompleteAsync = <
  T extends FieldValues,
  TOption extends { value: string | number } // 🔥 CLAVE
>({
  name,
  control,
  label,
  options,
  loading,
  disabled,
  getOptionLabel,
  isOptionEqualToValue,
  onInputChange,
  onChangeExternal,
}: FormAutocompleteAsyncProps<T, TOption>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          options={options}
          loading={loading}
          filterOptions={(x) => x}

          disabled={disabled}

          // 🔥 valor controlado seguro
          value={field.value ?? null}

          getOptionLabel={getOptionLabel}

          // 🔥 IDENTIDAD REAL (OBLIGATORIO)
          isOptionEqualToValue={
            isOptionEqualToValue ??
            ((opt, val) => opt?.value === val?.value)
          }

          // 🔥 búsqueda
          onInputChange={(_, value, reason) => {
            if (reason === "input") {
              onInputChange?.(value);
            }

            if (reason === "clear") {
              onInputChange?.("");
            }
          }}

          // 🔥 selección
          onChange={(_, value) => {
            field.onChange(value);
            onChangeExternal?.(value);
          }}

          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={error?.message}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    />
  );
};
*/ }
