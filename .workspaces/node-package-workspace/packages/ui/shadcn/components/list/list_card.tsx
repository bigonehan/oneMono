"use client";

import type { ReactNode } from "react";

type ListCardProps = {
  title: string;
  author: string;
  thumbnailUrl?: string;
  onTitleClick?: () => void;
  children?: ReactNode;
  actions?: ReactNode;
};

const fallbackThumbnail =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=640&q=80";

export const ListCard = ({
  title,
  author,
  thumbnailUrl,
  onTitleClick,
  children,
  actions,
}: ListCardProps) => (
  <article className="list-card">
    <img
      className="list-card__thumbnail"
      src={thumbnailUrl ?? fallbackThumbnail}
      alt={`${title} thumbnail`}
      loading="lazy"
    />
    <div className="list-card__content">
      <p className="list-card__author">{author}</p>
      <button type="button" className="list-card__title" onClick={onTitleClick}>
        {title}
      </button>
      {children ? <div className="list-card__body">{children}</div> : null}
      {actions ? <div className="list-card__actions">{actions}</div> : null}
    </div>
  </article>
);
