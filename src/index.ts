enum NodeTypes {
  ELEMENT,
  TEXT,
  COMMENT,
}

interface VNode {
  type: NodeTypes
  tag?: string
  selfClose?: true
  attributes?: Record<string, string | true>
  content?: string
  children?: VNode[]
}

export const parseHTML = (html: string) => {
  const nodes: VNode[] = []

  while (html) {
    if (html[0] === '<') {
      if (html[1] === '!') {
        // https://html.spec.whatwg.org/multipage/parsing.html#markup-declaration-open-state
        if (html.startsWith('<!--')) {
          // parseComment
          const endToken = '-->'
          const endIndex = html.indexOf(endToken)
          if (endIndex !== -1) {
            nodes.push({
              type: NodeTypes.COMMENT,
              content: html.slice(4, endIndex),
            })
            html = html.slice(endIndex + endToken.length)
            continue
          }
        }

        if (html.startsWith('<!DOCTYPE')) {
          const endToken = '>'
          const endIndex = html.indexOf(endToken)
          // TODO
          html = html.slice(endIndex + endToken.length)
          continue
        }

        if (html.startsWith('<![CDATA[')) {
          const endToken = ']]>'
          const endIndex = html.indexOf(endToken)
          // TODO
          html = html.slice(endIndex + endToken.length)
          continue
        }
      }

      if (/[a-z]/i.test(html[1])) {
        // Element
        // TODO
        continue
      }
    }
    nodes.push({
      type: NodeTypes.TEXT,
      content: html,
    })
    break
  }
  return nodes
}
