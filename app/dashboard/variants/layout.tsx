export default function VariantsLayout({
  children,
  modals,
}: Readonly<{
  children: React.ReactNode;
  modals: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {modals}
    </>
  );
}
