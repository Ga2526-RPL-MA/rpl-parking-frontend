import Typography from "@/components/Typography";

export default function TypographyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1200px] items-center justify-center py-20">
      {VARIANTS.map((variant) => (
        <Typography key={variant} variant={variant} weight="regular">
          {variant} - Typography
        </Typography>
      ))}
    </main>
  );
}

const VARIANTS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "title",
  "body",
  "label",
] as const;
