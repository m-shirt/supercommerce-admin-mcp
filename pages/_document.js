import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />

        {/* Meta tags */}
        <meta name="description" content="Supercommerce MCP Server - Model Context Protocol server for comprehensive e-commerce management with 130+ API tools for products, orders, customers, inventory, and more." />
        <meta name="keywords" content="supercommerce, mcp, model context protocol, e-commerce, api, claude, postman" />
        <meta name="author" content="Supercommerce" />

        {/* Open Graph */}
        <meta property="og:title" content="Supercommerce MCP Server" />
        <meta property="og:description" content="Model Context Protocol server for comprehensive e-commerce management" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.svg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Supercommerce MCP Server" />
        <meta name="twitter:description" content="Model Context Protocol server for comprehensive e-commerce management" />
        <meta name="twitter:image" content="/logo.svg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}