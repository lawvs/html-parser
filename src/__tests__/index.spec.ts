import { parseHTML } from '..'

describe.skip('base', () => {
  test('should parser works', () => {
    const nodes = parseHTML(
      '<div id="main" data-x="hello">Hello<span id="sub" /></div>'
    )
    expect(nodes).toStrictEqual({
      tag: 'div',
      selfClose: false,
      attributes: {
        id: 'main',
        'data-x': 'hello',
      },
      text: 'Hello',
      children: [
        {
          tag: 'span',
          selfClose: true,
          attributes: {
            id: 'sub',
          },
        },
      ],
    })
  })
})

describe('Comment', () => {
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
