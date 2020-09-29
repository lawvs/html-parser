enum NodeTypes {
  ELEMENT = 'ELEMENT',
  TEXT = 'TEXT',
  COMMENT = 'COMMENT',
}

interface VNode {
  type: NodeTypes
  tag?: string
  isSelfClosing?: boolean
  attributes?: Record<string, string | true>
  content?: string
  children?: VNode[]
}

export const parseHTML = (html: string) => {
  const nodes: VNode[] = []

  let last: string = ''
  while (html) {
    console.assert(html !== last, html)
    last = html
    if (html[0] === '<') {
      if (html[1] === '!') {
        // https://html.spec.whatwg.org/multipage/parsing.html#markup-declaration-open-state
        if (html.startsWith('<!--')) {
          // parseComment
          const endToken = '-->'
          const endIndex = html.indexOf(endToken)
          if (endIndex === -1) {
            throw new Error('missing end tag:\n' + html)
          }
          nodes.push({
            type: NodeTypes.COMMENT,
            content: html.slice(4, endIndex),
          })
          html = html.slice(endIndex + endToken.length)
          continue
        }

        if (html.startsWith('<!DOCTYPE')) {
          const endToken = '>'
          const endIndex = html.indexOf(endToken)
          if (endIndex === -1) {
            throw new Error('missing end tag:\n' + html)
          }
          // TODO
          html = html.slice(endIndex + endToken.length)
          continue
        }

        if (html.startsWith('<![CDATA[')) {
          const endToken = ']]>'
          const endIndex = html.indexOf(endToken)
          if (endIndex === -1) {
            throw new Error('missing end tag:\n' + html)
          }
          // TODO
          html = html.slice(endIndex + endToken.length)
          continue
        }
      }

      //#region Element
      const tagName = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(html)![1]
      html = html.slice(tagName.length + 1)
      while (!html.startsWith('>') && !html.startsWith('/>')) {
        // attributes
        html = html.slice(1, html.indexOf(' '))
        // TODO parse attributes
      }
      const isSelfClosing = html.startsWith('/>')
      let children: VNode[] | undefined
      if (isSelfClosing) {
        // '/>'
        html = html.slice(2)
      } else {
        // '>'
        const endToken = `</${tagName}>`
        const endIndex = html.indexOf(endToken)
        if (endIndex === -1) {
          throw new Error('missing end tag:\n' + html)
        }

        children = parseHTML(html.slice(1, endIndex))
        html = html.slice(endIndex + endToken.length)
      }
      nodes.push({
        type: NodeTypes.ELEMENT,
        tag: tagName,
        isSelfClosing,
        // attributes: {},
        children,
      })

      continue
      //#endregion
    }

    //#region Text
    const endToken = '<'
    const endIndex = html.indexOf(endToken)
    if (endIndex === -1) {
      nodes.push({
        type: NodeTypes.TEXT,
        content: html,
      })
      html = ''
      continue
    }
    nodes.push({
      type: NodeTypes.TEXT,
      content: html.slice(0, endIndex),
    })
    html = html.slice(endIndex)
    //#endregion
  }
  return nodes
}
