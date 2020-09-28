import { parseHTML } from "..";

describe.skip("base", () => {
  test("should parser works", () => {
    const nodes = parseHTML(
      '<div id="main" data-x="hello">Hello<span id="sub" /></div>'
    );
    expect(nodes).toStrictEqual({
      tag: "div",
      selfClose: false,
      attributes: {
        id: "main",
        "data-x": "hello",
      },
      text: "Hello",
      children: [
        {
          tag: "span",
          selfClose: true,
          attributes: {
            id: "sub",
          },
        },
      ],
    });
  });
});

describe("Text", () => {
  test("simple text", () => {
    const ast = parseHTML("some text");

    expect(ast).toMatchInlineSnapshot(`
      Array [
        Object {
          "content": "some text",
          "type": 1,
        },
      ]
    `);
  });
});
