"use client";

import { CardList } from "./card_list";
import type { CardItemProps } from "./card_item";
import { ProjectTypeChip } from "./project_type_chip";

type BlogShowcasePost = {
  path: string;
  title: string;
  description: string;
  imageUrl: string;
  labels: string[];
  date?: string;
};

type ListBlogShowcaseProps = {
  featured: BlogShowcasePost;
  items: BlogShowcasePost[];
};

export const ListBlogShowcase = ({ featured, items }: ListBlogShowcaseProps) => (
  <section className="blog-showcase" aria-label="Blog showcase">
    <a className="blog-showcase__featured" href={`/article/${featured.path}`}>
      <img className="blog-showcase__featured-image" src={featured.imageUrl} alt={featured.title} loading="lazy" />
      <div className="blog-showcase__featured-content">
        <p className="blog-showcase__meta">
          {featured.labels.map((label) => (
            <ProjectTypeChip chipClassName="blog-showcase__chip" key={`${featured.path}-${label}`} value={label} />
          ))}
          {featured.date ? <span>{featured.date}</span> : null}
        </p>
        <h1>{featured.title}</h1>
        <p className="blog-showcase__description">{featured.description}</p>
        <span className="blog-showcase__link">Read Article ↗</span>
      </div>
    </a>
    <CardList
      items={items.map((item): CardItemProps => ({
        path: item.path,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        labels: item.labels,
        date: item.date,
      }))}
    />
  </section>
);

export type { BlogShowcasePost, ListBlogShowcaseProps };
