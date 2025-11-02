interface SectionProps {
    id?: string
    heading: string
    body: string
    href?: string
    index: number
}

export default function Basic_tdli({ id, heading, body, href, index }: SectionProps) {
    const isOnLeft = index % 2 === 1
    const sectionId = id ?? `section-${index}`

    return (
        <section
            id={sectionId}
            className="grid h-screen w-full grid-cols-6 items-center"
        >
            <div
                className={`text col-span-2 h-fit space-y-4 ${isOnLeft ? "col-start-2 text-right" : "col-start-4"
                    }`}
            >
                <h2
                    data-section-heading
                    className="text-2xl font-bold leading-normal tracking-tight text-foreground sm:text-3xl lg:text-6xl">
                    {heading}
                </h2>
                <p
                    data-section-body
                    className="text-foreground/70 lg:text-lg">
                    {body}
                    {!!href && (
                        <>
                            <br />
                            <br />
                            <a
                                target="_blank"
                                href={href}
                                rel="noreferrer"
                                className="text-inherit w-fit rounded bg-black/40 px-3 py-1"
                            >
                                Learn more
                            </a>
                        </>
                    )}
                </p>
            </div>
        </section>
    )
}
