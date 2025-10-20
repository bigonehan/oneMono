import type { Link } from "@ui/shadcn/types";
import { SectionWrapper } from "../SectionWrapper";

interface FooterDataprop {
  logo?: string;
  logoText?: string;
  description?: string;
  socialLinks?: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  links?: {
    title: string;
    items: {
      label: string;
      href: string;
    }[];
  }[];
  copyright?: string;
}

interface Footer_2prop {
  data: FooterDataprop;
  Link: Link; // Accept Link as prop
}

export function Footer_2({ data, Link }: Footer_2prop) {
  return (
    <SectionWrapper
      className="border-t border-border/40 bg-background py-12"
      contentClassName="space-y-12"
    >
      <footer className="grid gap-8 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            {data.logo ? (
              <img
                src={data.logo || "/placeholder.svg"}
                alt="Logo"
                className="h-8 w-8"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary" />
            )}
            {data.logoText && (
              <span className="font-sans text-xl font-bold text-foreground">
                {data.logoText}
              </span>
            )}
          </Link>
          {data.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          )}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {data.socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {data.links && data.links.length > 0 && (
          <>
            {data.links.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </footer>

      <div className="border-t border-border/40 pt-8">
        <p className="text-center text-sm text-muted-foreground">
          {data.copyright}
        </p>
      </div>
    </SectionWrapper>
  );
}
