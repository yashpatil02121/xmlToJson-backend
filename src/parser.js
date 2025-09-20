function decodeEntities(str) {
    return str
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  }
  
  function parseAttributes(str) {
    const attrs = {};
    const attrPattern = /([\w:-]+)\s*=\s*"(.*?)"/g;
    let match;
    while ((match = attrPattern.exec(str))) {
      attrs["_" + match[1]] = decodeEntities(match[2]);
    }
    return attrs;
  }
  
  function attachChild(obj, tagName, value) {
    if (!obj[tagName]) {
      obj[tagName] = value;
    } else if (Array.isArray(obj[tagName])) {
      obj[tagName].push(value);
    } else {
      obj[tagName] = [obj[tagName], value];
    }
  }
  
  function parseNode(xml) {
    xml = xml.trim();
    const obj = {};
  
    const tagPattern = /<([\w:-]+)([^>]*)>([\s\S]*?)<\/\1>|<([\w:-]+)([^>]*)\/>/g;
    let lastIndex = 0;
    let match;
  
    while ((match = tagPattern.exec(xml))) {
      if (match.index > lastIndex) {
        const text = xml.slice(lastIndex, match.index).trim();
        if (text) {
          return decodeEntities(text);
        }
      }
  
      if (match[1]) {
        // Normal <tag> ... </tag>
        const tagName = match[1];
        const attrs = parseAttributes(match[2]);
        const content = match[3].trim();
  
        let child = parseNode(content);
        if (typeof child === "string") {
          // Element has only text
          const node = { ...attrs };
          node[tagName] = decodeEntities(child);
          attachChild(obj, tagName, node[tagName] ? node[tagName] : node);
        } else {
          const node = { ...attrs, ...child };
          attachChild(obj, tagName, node);
        }
      } else if (match[4]) {
        // Self-closing <tag />
        const tagName = match[4];
        const attrs = parseAttributes(match[5]);
        attachChild(obj, tagName, attrs);
      }
  
      lastIndex = tagPattern.lastIndex;
    }
  
    if (lastIndex < xml.length) {
      const text = xml.slice(lastIndex).trim();
      if (text) {
        return decodeEntities(text);
      }
    }
  
    return obj;
  }
  
  export function parseXML(xmlString) {
    xmlString = xmlString
      .replace(/<\?xml.*?\?>/, "")   // remove declaration
      .replace(/<!--[\s\S]*?-->/g, "") // remove comments
      .trim();
  
    return parseNode(xmlString);
  }
  