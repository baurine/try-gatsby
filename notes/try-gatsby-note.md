# Try Gatsby

Try to learn how to build static blog site by [Gatsby](https://www.gatsbyjs.org/), prepare for migrating my blog site to it from Jekyll.

[Gatsby tutorial](https://www.gatsbyjs.org/tutorial/) is very awesome and specific, it is very easy to follow step by step. Because I am already familiar with React/GraphQL/Next.js before, so it is no much difficult for me to understand the Gatsby.

The only place not very clear for me is that how to reference local asset files (images, docs etc) in markdown file.

After doing some research, I found just "gatsby-remark-copy-linked-files" plugin is enough, or you can choose "gatsby-remark-images" to handle images in markdown file while "gatsby-remark-copy-linked-files" to handle other types files.

A good example to demo use markdown files as content source: [gatsby-example-using-remark](https://using-remark.gatsbyjs.org/)

Some others learned from the tutorial:

- Use Typography.js to customize the style

## gatsby-node.js

The gatsby-node.js is very important for you to generate the posts pages dynamically. You need to export 2 methods: `onCreateNode` and `createPages`. 

In `onCreateNode` method, we usually generate the slug for each markdown file according to its file name, the slug will be used to generate the post path in `createPages` method, and they are will be same usually. It depends on your preference for what the slug looks like, for example, the markdown file `2018-12-08-migrate-to-gatsby.md`, you can set the slug same as its file name to `2018-12-08-migrate-to-gatsby`, but I want to keep it as compatible as the old blog site post url `/2018/12/08/migrate-to-gatsby.html`, so I set the slug to `/2018/12/08/migrate-to-gatsby/`. You need to call `createNodeFiled` API to save the generated slug value to each node.

In `createPages` method, we traverse all markdown files, call `createPage` API to create page for each markdown file.

An example gatsby-node.js copied from my [gatsby-blog](https://github.com/baurine/gatsby-blog) project:

    const path = require('path')

    // input: 2018-10-02-uninterrupted-audio-player-turbolinks
    // output: /2018/10/02/uninterrupted-audio-player-turbolinks/
    const convertNameToPath = (name) => {
      const arr = name.split('-')
      const path1 = arr.slice(0, 3).join('/')
      const path2 = arr.slice(3).join('-')
      return `/${path1}/${path2}/`
    }

    exports.onCreateNode = ({ node, getNode, actions }) => {
      if (node.internal.type === `MarkdownRemark`) {
        // node.parent is an id
        // `getNode(nodeId)` finds Node by id
        // MarkdownRemark node's parent should be a File Node which has some fileds likes name/relativePath ...
        const parentFileNode = getNode(node.parent)
        const fileName = parentFileNode.name
        // console.log(parentFileNode.name)
        // output: 2018-10-02-uninterrupted-audio-player-turbolinks
        // I will use this name to generate the page slug and path
        // the path will be /2018/10/02/uninterrupted-audio-player-turbolinks/ to be compatible with old url link
        const { createNodeField } = actions
        createNodeField({
          node,
          name: `slug`,
          value: convertNameToPath(fileName)
        })
      }
    }

    exports.createPages = ({ graphql, actions }) => {
      const { createPage } = actions
      return new Promise((resolve, reject) => {
        graphql(`
          query {
            allMarkdownRemark {
              edges {
                node {
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `)
        .then(result => {
          // console.log(JSON.stringify(result, null, 2))
          result.data.allMarkdownRemark.edges.forEach(({ node }) => {
            const slug = node.fields.slug
            createPage({
              path: slug,
              component: path.resolve('./src/templates/blog-post.js'),
              context: { 
                slug
              }
            })
          })
          resolve()
        })
      })
    }

## Netlify CMS

- [Sourcing from Netlify CMS](https://www.gatsbyjs.org/docs/sourcing-from-netlify-cms/)
- [Netlify CMS Authentication Providers](https://www.netlify.com/docs/authentication-providers/)

Netlify CMS 是用来提供给非程序员使用的，界面友好的内容提交方式。它的最终实际效果和你自己手动往 Git Repo 里提交一篇 markdown 没有任何区别。

当你在 Netlify CMS 的 Dashboard 上提交一篇 blog 后，它实际是生成一个 markdown 的文件并提交到 Git Repo 中。

而 `/static/admin/config.yml` 是用来告诉 Netlify CMS，markdown 文件要放在哪个目录，图片等 assets 放在哪个目录等，markdown 的文件头需要包含哪些 fields。

    # /static/admin/config.yml
    backend:
      name: github
      repo: baurine/try-gatsby

    # the uploaded assets will put in `/admin/static/assets/` folder
    # when build, the assets will output to `/public/assets/` folder
    media_folder: static/assets
    public_folder: assets

    collections:
      - name: blog
        label: Blog
        folder: blog # the commited markdown file will put in `/blog/` folder
        create: true
        fields:
          - { name: path,  label: Path }
          - { name: date,  label: Date, widget: date }
          - { name: title, label: Title }
          - { name: body,  label: Body, widget: markdown }

## Contentful

[Contentful](https://www.contentful.com/)，类似 Netlify CMS，只不过 Netlify CMS 只为你提供用户友好的输入界面，数据直接以 markdown 的文本形式存储在你的 git repo 中，而 Contentful 是存储在它的服务器上，并提供 API 供你访问这些数据，功能和灵活性会比 Netlify CMS 强大。

- [In the trenches with Gatsby + Contentful + Netlify](https://medium.com/stories-from-upstatement/in-the-trenches-with-gatsby-contentful-netlify-53a7fea23d37)
