export const RemoveHTMLTags = (html: string) => {
  var regX = /(<([^>]+)>)/gi;
  return html.replace(regX, "");
};
