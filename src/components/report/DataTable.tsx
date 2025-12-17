interface Column {
  header: string;
  accessor: string;
}

interface DataTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

const DataTable = ({ columns, data }: DataTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
              S.No
            </th>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {index + 1}
              </td>
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-3 text-sm text-foreground font-medium">
                  {row[col.accessor] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
