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
            throw new Error('Missing end tag:\n' + html)
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
            throw new Error('Missing end tag:\n' + html)
          }
          // TODO handle DOCTYPE
          html = html.slice(endIndex + endToken.length)
          continue
        }

        if (html.startsWith('<![CDATA[')) {
          const endToken = ']]>'
          const endIndex = html.indexOf(endToken)
          if (endIndex === -1) {
            throw new Error('Missing end tag:\n' + html)
          }
          // TODO handle CDATA
          html = html.slice(endIndex + endToken.length)
          continue
        }
      }

      //#region Element
      // <div>
      // <div />
      // <div id="">
      const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(html)
      if (!match) {
        throw new Error('Error on match tag name:\n' + html)
      }
      const tagName = match[1]
      // (<div) id=""
      html = html.slice(tagName.length + 1)

      const attributes: Record<string, string | true> = {}
      while (true) {
        // attributes
        // (<div )id=""
        html = html.trimStart()
        if (html.startsWith('>') || html.startsWith('/>')) {
          break
        }
        const match = /^[^\t\r\n\f />=]*/.exec(html)
        if (!match) {
          throw new Error('Error on match attribute name:\n' + html)
        }
        const name = match[0]
        // (<div id)=""
        html = html.slice(name.length)
        // TODO handle duplicate attribute
        const isNoValue = !html.startsWith('=')
        if (isNoValue) {
          attributes[name] = true
          continue
        }
        // (<div id=)""
        html = html.slice(1)
        const quote = html[0]
        const isQuoted = quote === `"` || quote === `'`
        console.assert(isQuoted, html)
        const endIndex = html.indexOf(quote, 1)
        const value = html.slice(1, endIndex)
        attributes[name] = value
        // (<div id="")
        html = html.slice(endIndex + 1)
      }
      const isSelfClosing = html.startsWith('/>')
      let children: VNode[] = []
      if (isSelfClosing) {
        // '/>'
        html = html.slice(2)
      } else {
        // '>'
        const endToken = `</${tagName}>`
        const endIndex = html.indexOf(endToken)
        if (endIndex === -1) {
          throw new Error('Missing end tag:\n' + html)
        }

        children = parseHTML(html.slice(1, endIndex))
        html = html.slice(endIndex + endToken.length)
      }
      nodes.push({
        type: NodeTypes.ELEMENT,
        tag: tagName,
        isSelfClosing,
        attributes,
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
