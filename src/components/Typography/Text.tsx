export function Text({ children }: { children: React.ReactNode }) {
    return (
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl pb-4 text-primary">
        {children}
      </h1>
    )
  }