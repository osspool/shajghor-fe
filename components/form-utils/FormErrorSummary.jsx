export const FormErrorSummary = ({ errors }) => {
  if (Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div className="bg-destructive/15 p-3 rounded-md border border-destructive/20">
      <h4 className="text-sm font-medium text-destructive mb-2">Please fix the following errors:</h4>
      <ul className="text-sm text-destructive space-y-1">
        {Object.entries(errors).map(([field, error]) => (
          <li key={field} className="flex items-start gap-2">
            <span className="text-destructive">•</span>
            <span>
              <strong>{field}:</strong> {error.message}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}; 