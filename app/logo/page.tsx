import Logo from "@/components/logo"

export default function LogoPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12">
      <h1 className="mb-8 text-3xl font-bold text-navy">Motion Muse Logo</h1>

      <div className="mb-12 rounded-lg border border-muted p-8 shadow-sm">
        <Logo width={300} height={100} />
      </div>

      <div className="space-y-4 text-center">
        <h2 className="text-xl font-semibold text-navy">Logo Usage</h2>
        <p className="max-w-md text-muted-foreground">
          The Motion Muse logo features a dynamic design with colorful arcs in blue, green, yellow, purple, pink, and
          orange, surrounding the company name. "MOTION" appears in navy blue while "MUSE" is highlighted in red,
          representing creativity and movement.
        </p>
        <p className="max-w-md text-muted-foreground">
          The logo is available as a PNG file with transparency at
          <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-sm">
            /public/images/motionmuse-logo.png
          </code>
        </p>
      </div>
    </div>
  )
}
