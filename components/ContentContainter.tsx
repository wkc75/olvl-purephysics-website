export default function ContentContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {children}
    </div>
  );
}
