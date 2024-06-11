import { Html, Head, Main, NextScript } from "next/document"

const { NEXT_PUBLIC_url } = process.env

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* Below we insert the modal wrapper*/}
        <div id="modal-root"></div>
      </body>
    </Html>
  )
}
