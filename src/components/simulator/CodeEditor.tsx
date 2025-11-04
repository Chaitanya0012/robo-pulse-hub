import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const CodeEditor = ({ value, onChange, readOnly = false }: CodeEditorProps) => {
  const { theme } = useTheme();

  return (
    <div className="h-[400px] border rounded-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        onChange={(value) => onChange(value || "")}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};
