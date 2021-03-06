import { parseHTML } from '..'

describe('base', () => {
  test('should parser works', () => {
    const nodes = parseHTML(
      '<div id="main" data-x="hello">Hello<span id="sub" /></div>'
    )
    expect(nodes).toStrictEqual([
      {
        type: 'ELEMENT',
        tag: 'div',
        isSelfClosing: false,
        attributes: {
          id: 'main',
          'data-x': 'hello',
        },
        children: [
          {
            type: 'TEXT',
            content: 'Hello',
          },
          {
            type: 'ELEMENT',
            tag: 'span',
            isSelfClosing: true,
            attributes: {
              id: 'sub',
            },
            children: [],
          },
        ],
      },
    ])
  })
})

describe('Comment', () => {
  test('empty comment', () => {
    const ast = parseHTML('<!---->')

    expect(ast).toStrictEqual([
      {
        type: 'COMMENT',
        content: '',
      },
    ])
  })

  test('simple comment', () => {
    const ast = parseHTML('<!-- comment -->')

    expect(ast).toStrictEqual([
      {
        type: 'COMMENT',
        content: ' comment ',
      },
    ])
  })
})

describe('Text', () => {
  test('simple text', () => {
    const ast = parseHTML('some text')

    expect(ast).toStrictEqual([
      {
        type: 'TEXT',
        content: 'some text',
      },
    ])
  })

  test('simple text with comment', () => {
    const ast = parseHTML('some text<!-- comment -->')

    expect(ast).toStrictEqual([
      {
        type: 'TEXT',
        content: 'some text',
      },
      {
        type: 'COMMENT',
        content: ' comment ',
      },
    ])
  })
})

describe('Element', () => {
  test('simple div', () => {
    const ast = parseHTML('<div>hello</div>')

    expect(ast).toStrictEqual([
      {
        type: 'ELEMENT',
        tag: 'div',
        isSelfClosing: false,
        attributes: {},
        children: [
          {
            type: 'TEXT',
            content: 'hello',
          },
        ],
      },
    ])
  })

  test('simple text with invalid end tag', () => {
    expect(() => parseHTML('some text</div>')).toThrowError()
  })

  test('empty', () => {
    const ast = parseHTML('<div></div>')

    expect(ast).toStrictEqual([
      {
        type: 'ELEMENT',
        tag: 'div',
        isSelfClosing: false,
        attributes: {},
        children: [],
      },
    ])
  })

  test('self closing', () => {
    const ast = parseHTML('<div/>after')

    expect(ast).toStrictEqual([
      {
        type: 'ELEMENT',
        tag: 'div',
        isSelfClosing: true,
        attributes: {},
        children: [],
      },
      {
        type: 'TEXT',
        content: 'after',
      },
    ])
  })

  test('attribute with no value', () => {
    const ast = parseHTML('<div id></div>')

    expect(ast).toStrictEqual([
      {
        type: 'ELEMENT',
        tag: 'div',
        isSelfClosing: false,
        attributes: {
          id: true,
        },
        children: [],
      },
    ])
  })

  test('attribute with multiple no value', () => {
    const ast = parseHTML('<div id class></div>')

    expect(ast).toStrictEqual([
      {
        type: 'ELEMENT',
        tag: 'div',
        isSelfClosing: false,
        attributes: {
          id: true,
          class: true,
        },
        children: [],
      },
    ])
  })

  test('attribute with value', () => {
    const ast = parseHTML('<div id=""></div>')

    expect(ast).toStrictEqual([
      {
        type: 'ELEMENT',
        tag: 'div',
        isSelfClosing: false,
        attributes: {
          id: '',
        },
        children: [],
      },
    ])
  })

  test('attribute with multiple value', () => {
    const ast = parseHTML('<div id="root" class="button disabled"></div>')

    expect(ast).toStrictEqual([
      {
        type: 'ELEMENT',
        tag: 'div',
        isSelfClosing: false,
        attributes: {
          id: 'root',
          class: 'button disabled',
        },
        children: [],
      },
    ])
  })

  test('void element', () => {
    const ast = parseHTML('<img>after')

    expect(ast).toStrictEqual([
      {
        type: 'ELEMENT',
        tag: 'img',
        isSelfClosing: false,
        attributes: {},
        children: [],
      },
      {
        type: 'TEXT',
        content: 'after',
      },
    ])
  })
})
