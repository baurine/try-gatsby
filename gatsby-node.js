const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  console.log('\nonCreateNode: ===> ', node.internal.type)
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent)
    console.log(`\n`, fileNode.relativePath)

    const slug = createFilePath({ node, getNode, basePath: `pages` })
    console.log(slug)
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}
