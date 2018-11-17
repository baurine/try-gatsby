import React from "react"
import BasicLayout from "../layouts/BasicLayout"
import { graphql } from "gatsby"

export default ({ data }) => (
  <BasicLayout>
    <h1>About {data.site.siteMetadata.title}</h1>
    <p>I’m good enough, I’m smart enough, and gosh darn it, people like me!</p>
  </BasicLayout>
)

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
