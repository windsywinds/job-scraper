const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

async function purifyDesc(description: string): Promise<string> {
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);

  // Configure what should be accepted and rejected
  const config = {
    ALLOWED_TAGS: ['a'], // Only allow <a> tags
    ADD_ATTR: ['href', 'target'], // Allow the href and target attributes on <a> tags
    FORBID_ATTR: ['class'], // Forbid the class attribute on all tags
    FORBID_TAGS: ['script'],
  };

  const cleanDesc = DOMPurify.sanitize(description, config);

  return cleanDesc;
}

export default purifyDesc;
