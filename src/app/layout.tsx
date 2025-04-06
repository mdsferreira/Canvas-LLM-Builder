import "@/styles/globals.css";
import { AgentProvider } from "@/lib/context";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AgentProvider>{children}</AgentProvider>
            </body>
        </html>
    );
}
