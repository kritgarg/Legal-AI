import "./globals.css";



export const metadata = {
  title: "LegalEase",
  description: "AI-Powered Contract Analysis",
    icons: {
    icon: "/Logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        
        {children}
        
      </body>
    </html>
  );
}
