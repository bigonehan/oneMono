"use client";

type CardItemProps = {
  path: string;
  title: string;
  description: string;
  imageUrl: string;
  labels?: string[];
  date?: string;
};

export const CardItem = ({ path, title, description, imageUrl, labels = [], date }: CardItemProps) => (
  <a className="card-item" href={`/article/${path}`}>
    <img className="card-item__image" src={imageUrl} alt={title} loading="lazy" />
    <div className="card-item__content">
      <p className="card-item__meta">
        {labels.map((label) => (
          <span className="card-item__chip" key={`${path}-${label}`}>{label}</span>
        ))}
        {date ? <span>{date}</span> : null}
      </p>
      <h3>{title}</h3>
      <p className="card-item__description">{description}</p>
    </div>
  </a>
);

export type { CardItemProps };
