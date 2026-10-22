// An image alone in its paragraph becomes a figure; its title becomes the caption.
// Markdown: ![What the photo shows](./garden.jpg "Caption") — start the caption with "wide:" for a wide figure.
export default function rehypeFigures() {
  return (tree) => walk(tree);
}
function walk(node) {
  if (!node.children) return;
  node.children.forEach((child, i) => {
    if (child.type === 'element' && child.tagName === 'p') {
      const kids = child.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
      if (kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'img') {
        const img = kids[0];
        const props = img.properties || {};
        let caption = props.title || '';
        let astro = props.__ASTRO_IMAGE_ ? JSON.parse(props.__ASTRO_IMAGE_) : null;
        if (!caption && astro?.title) caption = astro.title;
        const wide = /^wide:\s*/i.test(caption);
        caption = caption.replace(/^wide:\s*/i, '');
        if (astro) { delete astro.title; props.__ASTRO_IMAGE_ = JSON.stringify(astro); }
        delete props.title;
        node.children[i] = {
          type: 'element', tagName: 'figure', properties: wide ? { className: ['wide'] } : {},
          children: [img, ...(caption ? [{ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] }] : [])],
        };
        return;
      }
    }
    walk(child);
  });
}
