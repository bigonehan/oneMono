type ProgressBarProps = {
  currentValue: number;
  goalValue: number;
};

export function ProgressBar({ currentValue, goalValue }: ProgressBarProps) {
  const ratio = goalValue <= 0 ? 0 : currentValue / goalValue;
  const width = `${Math.min(ratio * 100, 100)}%`;

  return (
    <div className="campaign-progress" data-testid="campaign-progress">
      <div className="campaign-progress__track" aria-hidden="true">
        <div className="campaign-progress__fill" style={{ width }} data-testid="campaign-progress-fill" />
      </div>
      <div className="campaign-progress__meta">
        <span>{Math.round(ratio * 100)}% funded</span>
        <span>{ratio >= 1 ? "Goal reached" : "Goal in progress"}</span>
      </div>
    </div>
  );
}
