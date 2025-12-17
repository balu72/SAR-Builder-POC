interface FormFieldProps {
  label: string;
  value: string | undefined;
  fieldNumber?: string;
}

const FormField = ({ label, value, fieldNumber }: FormFieldProps) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        {fieldNumber && (
          <span className="text-xs text-primary font-semibold">{fieldNumber}</span>
        )}
        {label}
      </label>
      <div className="bg-muted/50 border border-border rounded-md px-4 py-2.5 text-foreground font-medium min-h-[42px] flex items-center">
        {value || <span className="text-muted-foreground/50">—</span>}
      </div>
    </div>
  );
};

export default FormField;
