import * as sanitizeHtml from "sanitize-html";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "span", "img", "video", "source", "h1", "h2", "h3", "h4", "h5", "h6",
    "li", "ol", "ul", "p", "pre", "a", "em", "strong", "u", "br"
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'width', 'height', 'style'],
    video: ['src', 'controls', 'width', 'height'],
    source: ['src', 'type'],
    embed: ['src', 'width', 'height', 'allowfullscreen'],
    span: ['style', 'class'],
    p: ['style', 'class'],
    em: ['style', 'class'],
    strong: ['style', 'class'],
    u: ['style', 'class'],
  },
  allowedClasses: {
    '*': [
      'ql-size-small', 'ql-size-large', 'ql-size-huge',
      'ql-align-center', 'ql-align-right', 'ql-align-justify',
      'ql-font-monospace', 'ql-font-serif', 'fancy', 'simple'
    ]
  },
  allowedStyles: {
    '*': {
      'color': [/^.*$/],
      'background-color': [/^.*$/],
      'text-align': [/^.*$/],
      'font-size': [/^\d+(?:px|em|%)$/],
      'font-family': [/^.*$/],
    },
    img: {
      'width': [/^\d+(px|%)?$/],
      'height': [/^\d+(px|%)?$/],
    },
    em: {
      'color': [/^.*$/],
      'background-color': [/^.*$/],
      'font-size': [/^\d+(?:px|em|%)$/],
      'font-family': [/^.*$/],
    },
  }
};

export const cleanHtml = (dirty: string): string => {
  if (!dirty) return '';
  return sanitizeHtml(dirty, SANITIZE_OPTIONS);
};