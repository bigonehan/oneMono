"use client";

import { CardItem } from "./card_item";
import type { CardItemProps } from "./card_item";

type CardListProps = {
  items: CardItemProps[];
};

export const CardList = ({ items }: CardListProps) => (
  <ul className="card-list">
    {items.map((item) => (
      <li key={item.path}>
        <CardItem {...item} />
      </li>
    ))}
  </ul>
);

export type { CardListProps };
