type TagBadgeProps = {
  label: string;
};

export function TagBadge({ label }: TagBadgeProps) {
  return <span className="ui-tag-badge">#{label}</span>;
}
