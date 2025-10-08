import * as React from "react"

/**
 * The main footer component for the application.
 * Contains company info, legal links, social media links, and sitemap.
 * @returns {JSX.Element} - The rendered footer component.
 */
const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground p-8">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-2">Company</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Legal</h3>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Connect</h3>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Site Map</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/pricing">Pricing</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-8 text-sm">
        <p>&copy; {new Date().getFullYear()} My Company, Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}

export { Footer }
