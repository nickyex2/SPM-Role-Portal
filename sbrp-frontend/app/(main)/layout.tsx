import R_Navbar from "../_components/R_Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <R_Navbar></R_Navbar>
      {children}
    </main>
  );
}
