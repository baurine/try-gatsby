import React from "react"
import BasicLayout from "../layouts/BasicLayout"
import { graphql, Link } from "gatsby"

export default ({ data }) => (
  <BasicLayout>
    <div>
      <h1>Amazing Pandas Eating Things</h1>
      <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
      {
        data.allMarkdownRemark.edges.map(({ node }) =>
          <div key={node.id}>
            <Link to={node.fields.slug}>
              <h3>{node.frontmatter.title}{" "}
                <span>- {node.frontmatter.date}</span>
              </h3>
            </Link>
            <p>{node.excerpt}</p>
          </div>
        )
      }
    </div>
  </BasicLayout>
)

export const query = graphql`
  query {
    allMarkdownRemark(sort: {fields:[frontmatter___date], order:DESC}) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }
  }
`
