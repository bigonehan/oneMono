"use client";

type ProjectTypeChipProps = {
  value: string;
  chipClassName: string;
};

type ProjectTypeMeta = {
  name: string;
  icon: string;
};

const PROJECT_TYPE_META: Record<string, ProjectTypeMeta> = {
  code: { name: "Code", icon: "</>" },
  movie: { name: "Movie", icon: "\u25b6" },
  write: { name: "Write", icon: "\u270E" },
  mono: { name: "Mono", icon: "\u25C9" },
};

export const ProjectTypeChip = ({ value, chipClassName }: ProjectTypeChipProps) => {
  const normalized = value.trim().toLowerCase();
  const meta = PROJECT_TYPE_META[normalized];

  if (!meta) {
    return (
      <span className={chipClassName}>
        {value}
      </span>
    );
  }

  return (
    <span className={`${chipClassName} project-type-chip`}>
      <span aria-hidden="true" className="project-type-chip__icon">
        {meta.icon}
      </span>
      <span className="project-type-chip__name">{meta.name}</span>
    </span>
  );
};
