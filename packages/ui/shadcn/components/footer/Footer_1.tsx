import * as React from "react";
import { SectionWrapper } from "../SectionWrapper";

/**
 * The main footer component for the application.
 * Contains company info, legal links, social media links, and sitemap.
 * @returns {JSX.Element} - The rendered footer component.
 */
const Footer_1 = () => {
  return (
    <SectionWrapper
      className="bg-muted text-muted-foreground"
      contentClassName="space-y-8"
    >
      <footer
        data-anim="pane"
        className="grid grid-cols-2 gap-8 md:grid-cols-4"
      >
        <div>
          <h3 data-anim="title" className="font-bold mb-2">
            Company
          </h3>
          <ul>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 data-anim="title" className="font-bold mb-2">
            Legal
          </h3>
          <ul>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 data-anim="title" className="font-bold mb-2">
            Connect
          </h3>
          <ul>
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">Twitter</a>
            </li>
            <li>
              <a href="#">Instagram</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 data-anim="title" className="font-bold mb-2">
            Site Map
          </h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/features">Features</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
          </ul>
        </div>
      </footer>
      <div className="text-center mt-8 text-sm">
        <p data-anim="description">
          &copy; {new Date().getFullYear()} My Company, Inc. All rights
          reserved.
        </p>
      </div>
    </SectionWrapper>
  );
};

export { Footer_1 };
