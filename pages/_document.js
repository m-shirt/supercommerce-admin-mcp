import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" sizes="32x32" href="/favicon.png" />
        <link rel="icon" sizes="16x16" href="/favicon.png" />

        {/* Meta tags */}
        <meta name="description" content="Supercommerce MCP Server - Model Context Protocol server for comprehensive e-commerce management with 130+ API tools for products, orders, customers, inventory, and more." />
        <meta name="keywords" content="supercommerce, mcp, model context protocol, e-commerce, api, claude, postman" />
        <meta name="author" content="Supercommerce" />

        {/* Open Graph */}
        <meta property="og:title" content="Supercommerce MCP Server" />
        <meta property="og:description" content="Model Context Protocol server for comprehensive e-commerce management" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/supercommerce-logo.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Supercommerce MCP Server" />
        <meta name="twitter:description" content="Model Context Protocol server for comprehensive e-commerce management" />
        <meta name="twitter:image" content="/supercommerce-logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}