function FlashVarsParser(domObject) {
  var varsString = domObject.attr("flashvars")
                || domObject.children()
                            .filter("param[name=flashvars]")
                            .attr("value")
                || "";
  this.assignments = varsString.split("&");
}

FlashVarsParser.prototype.valueFor = function(name) {
  var result = null;
  this.assignments.some(function(item, index, all) {
    var match = new RegExp("^" + name + "=(.+)").exec(item);
    if(match) {
      result = match[1];
      return true;
    } else {
      return false;
    }
  });
  return result;
}

