import React from "react";

import { Text, View } from "react-native";
import { Fonts } from "../Themes";

const ParserMap = {
  "<b>": {
    ComponentType: "text",
    style: {
      fontWeight: "bold"
    },
    closingTag: "</b>"
  },
  "<u>": {
    ComponentType: "text",
    style: {
      textDecorationLine: "underline"
    },
    closingTag: "</u>"
  },
  "<h1>": {
    ComponentType: "text",
    style: {
      fontSize: Fonts.fontSize.h1
    },
    closingTag: "</h1>"
  },
  "<h2>": {
    ComponentType: "text",
    style: {
      fontSize: Fonts.fontSize.h2
    },
    closingTag: "</h2>"
  },
  "<h3>": {
    ComponentType: "text",
    style: {
      fontSize: Fonts.fontSize.h3
    },
    closingTag: "</h3>"
  },
  "<h4>": {
    ComponentType: "text",
    style: {
      fontSize: Fonts.fontSize.h4
    },
    closingTag: "</h4>"
  },
  "<h5>": {
    ComponentType: "text",
    style: {
      fontSize: Fonts.fontSize.h5
    },
    closingTag: "</h5>"
  },
  "<h6>": {
    ComponentType: "text",
    style: {
      fontSize: Fonts.fontSize.h6
    },
    closingTag: "</h6>"
  },
  "<h7>": {
    ComponentType: "text",
    style: {
      fontSize: Fonts.fontSize.h7
    },
    closingTag: "</h7>"
  },
  "<pre>": {
    ComponentType: "text",
    style: {
      backgroundColor: "gray",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "black"
    },
    closingTag: "</pre>"
  },
  "<strike>": {
    ComponentType: "text",
    style: {
      fontDecorationLine: "line-through"
    },
    closingTag: "</strike>"
  },
  "<p>": {
    ComponentType: "text",
    style: {},
    closingTag: "</p>"
  },
  "<i>": {
    ComponentType: "text",
    style: {
      fontStyle: "italic"
    },
    closingTag: "</i>"
  },
  "<div>": {
    ComponentType: "view",
    style: {},
    closingTag: "</div>"
  },
  "<br>": {
    ComponentType: "newLine",
    text: "\n",
    style: {
      fontWeight: "bold"
    }
  }
};

const getClosingTagIndex = (text, openTag, closeTag) => {
  let newText = text.concat();

  while (newText.length > 2) {
    let openTagIndex = text.indexOf(openTag);
    let closeTagIndex = text.indexOf(closeTag);

    const textBetweenTags = text.substring(
      openTagIndex + openTag.length,
      closeTagIndex
    );
    const textAfterCloseTags = text.substring(
      closeTagIndex + 1 + closeTag.length,
      text.length
    );

    if (textBetweenTags.indexOf(openTag) === -1) {
      return closeTagIndex;
    }

    openTagIndex = textBetweenTags.indexOf(openTag);
    closeTagIndex =
      textAfterCloseTags.indexOf(closeTag) +
      textBetweenTags.length +
      openTag.length +
      closeTag.length;
    newText = textBetweenTags.concat(textAfterCloseTags);
  }

  return -1;
};

export const parseHtml = text => {
  const tagStartIndex = text.indexOf("<");
  const tagEndIndex = text.indexOf(">") + 1;

  if (tagStartIndex === -1 || tagEndIndex === 0) {
    return text;
  }

  const tag = text.substring(tagStartIndex, tagEndIndex);

  console.tron.log(text);
  console.log("IMPORTANT", tag);

  if (ParserMap[tag].ComponentType === "newLine") {
    console.log("HEREEE VIEWWW");
    return (
      <Text>
        {"\n"}
        {parseHtml(text.substring(tagEndIndex + 1, text.length))}
      </Text>
    );
  }

  const closingTag = `${text.substring(
    tagStartIndex,
    tagStartIndex + 1
  )}/${text.substring(tagStartIndex + 1, tagEndIndex)}`;

  const closingTagIndex = getClosingTagIndex(text, tag, closingTag);

  console.tron.log("here", tag);

  if (ParserMap[tag].ComponentType === "text") {
    return (
      <>
        <Text>{text.substring(0, tagStartIndex)}</Text>
        <Text style={ParserMap[tag].style}>
          {parseHtml(
            text.substring(tagStartIndex + tag.length, closingTagIndex)
          )}
        </Text>
        <Text>
          {parseHtml(
            text.substring(closingTagIndex + tag.length + 1, text.length)
          )}
        </Text>
      </>
    );
  }

  if (ParserMap[tag].ComponentType === "view") {
    console.log("HEREEE VIEWWW");
    return (
      <>
        <Text>{text.substring(0, tagStartIndex)}</Text>
        <Text style={ParserMap[tag].style}>
          {"\n"}
          {parseHtml(
            text.substring(tagStartIndex + tag.length, closingTagIndex)
          )}
        </Text>
        <Text>
          {"\n"}
          {parseHtml(
            text.substring(closingTagIndex + tag.length + 1, text.length)
          )}
        </Text>
      </>
    );
  }

  console.log("posibil");

  return text;
};
