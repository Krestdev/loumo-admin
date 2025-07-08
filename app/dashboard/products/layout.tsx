export default function ProductsLayout({
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
