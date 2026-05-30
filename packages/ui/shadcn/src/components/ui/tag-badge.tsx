type TagBadgeProps = {
  label: string;
};

export const TagBadge = ({ label }: TagBadgeProps) => (
  <span className="tag-badge">{label}</span>
);
