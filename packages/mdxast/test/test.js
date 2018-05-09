const fs = require('fs')
const unified = require('unified')
const remark = require('remark-parse')
const rehype = require('remark-rehype')
const matter = require('remark-frontmatter')
const html = require('rehype-stringify')
const blocks = require('remark-parse/lib/block-elements.json')

const toMdx = require('..')

const fixture = {
  basic: fs.readFileSync('test/fixtures/basic.md', 'utf8'),
  renderProps: fs.readFileSync('test/fixtures/render-props.md', 'utf8'),
}

const parseFixture = str => {
  const options = {
    blocks: blocks,
    matter: {
      type: 'yaml',
      marker: '-',
    },
  }

  const parser = unified()
    .use(remark, options)
    .use(matter, options.matter)
    .use(toMdx, options)
    .use(rehype)
    .use(html)

  return parser.processSync(str).contents
}

test('it parses a file', () => {
  const result = parseFixture(fixture.basic)
  expect(result).toMatchSnapshot()
})

test('using render props component', () => {
  const result = parseFixture(fixture.renderProps)
  expect(result).toMatchSnapshot()
})
