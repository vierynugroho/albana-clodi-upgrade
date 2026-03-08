import {
  Path,
  FieldValues,
  UseFormRegister,
  Controller,
  Control,
} from "react-hook-form";
import { Input } from "../ui/input";

type FormFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  nullable?: boolean;
  register: UseFormRegister<T>;
  error?: string;
  readOnly?: boolean;
};

export function FormField<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  nullable = false,
  register,
  error,
  readOnly = false,
}: FormFieldProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label} {!nullable && <span className="text-destructive">*</span>}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        error={!!error}
        readOnly={readOnly}
        className={readOnly ? "bg-muted cursor-not-allowed" : ""}
        {...register(name)}
      />
      {!nullable && error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  );
}

type RadioBtnFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  nullable?: boolean;
};

export function RadioBtnField<T extends FieldValues>({
  label,
  name,
  control,
  error,
  nullable = false,
}: RadioBtnFieldProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label} {!nullable && <span className="text-destructive">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={field.value === true}
                onChange={() => field.onChange(true)}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm">Ya</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={field.value === false}
                onChange={() => field.onChange(false)}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm">Tidak</span>
            </label>
          </div>
        )}
      />
      {!nullable && error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  );
}
