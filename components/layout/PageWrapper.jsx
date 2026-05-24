/**
 * PageWrapper
 * Consistent page padding and max-width container.
 */

export function PageWrapper({ children, className = "" }) {
  return (
    <main className={`max-w-lg mx-auto px-4 py-6 ${className}`}>
      {children}
    </main>
  );
}
