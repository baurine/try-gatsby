import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"

const ListLink = props => (
  <li style={{ display: `inline-block`, marginRight: `1rem` }}>
    <Link to={props.to}>{props.children}</Link>
  </li>
)

const NavHeader = ({ data }) => (
  <header style={{ marginBottom: `1.5rem` }}>
    <Link to="/" style={{ textShadow: `none`, backgroundImage: `none` }}>
      <h3 style={{ display: `inline` }}>{data.site.siteMetadata.title}</h3>
    </Link>
    <ul style={{ listStyle: `none`, float: `right` }}>
      <ListLink to="/">Home</ListLink>
      <ListLink to="/about/">About</ListLink>
      <ListLink to="/contact/">Contact</ListLink>
      <ListLink to="/about-css-modules/">Css Modules</ListLink>
      <ListLink to="/my-files/">Site Files</ListLink>
      <a href="https://github.com/baurine/try-gatsby">GitHub</a>
    </ul>
  </header>
)

const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default ({ children }) => (
  <StaticQuery
    query={query}
    render={data =>
      <div style={{ margin: `0 auto`, maxWidth: 800, padding: `20px 1rem` }}>
        <NavHeader data={data}/>
        {children}
      </div>
    }/>
)
