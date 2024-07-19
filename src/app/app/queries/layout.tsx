import { QueryToolSettingsProvider } from "@/lib/hooks/querytoolsettings";

export default function QueryPage ({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <QueryToolSettingsProvider>
      {children}
    </QueryToolSettingsProvider>
  )
}