(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['topicComment'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"card topic-comment\">\n  <div class=\"card-body\">\n    "
    + alias3(((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper)))
    + "\n  </div>\n  <div class=\"card-footer\">\n    <p class=\"card-subtitle\">\n Posted at "
    + alias3((helpers.formatDate || (depth0 && depth0.formatDate) || alias2).call(alias1,(depth0 != null ? depth0.postDate : depth0),{"name":"formatDate","hash":{},"data":data}))
    + " by "+ alias3(((helper = (helper = helpers.creator || (depth0 != null ? depth0.creator : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"creator","hash":{},"data":data}) : helper)))
    + "</p>\n  </div>\n</div>\n";
},"useData":true});
templates['topicQuestion'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"card topic-question\">\n  <div class=\"card-header\">\n    <h2 class=\"card-title\"><a class=\"card-title\" href=\"/topics/"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n</h2>\n</div>\n   <div class=\"card-body\">\n    "
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\n  </div>\n <div class=\"card-footer\">\n" 
    + "<p class=\"card-subtitle\">\n      Posted at "
    + alias4((helpers.formatDate || (depth0 && depth0.formatDate) || alias2).call(alias1,(depth0 != null ? depth0.postDate : depth0),{"name":"formatDate","hash":{},"data":data}))
    + " in \n      <a href=\"/categories/"
    + alias4(((helper = (helper = helpers.category || (depth0 != null ? depth0.category : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"category","hash":{},"data":data}) : helper)))
    + "\" class=\"category-link\">"
    + alias4(((helper = (helper = helpers.category || (depth0 != null ? depth0.category : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"category","hash":{},"data":data}) : helper)))
    + "</a>\n      with "
    + alias4(container.lambda(((stack1 = (depth0 != null ? depth0.comments : depth0)) != null ? stack1.length : stack1), depth0))
    + " comments\n  by "
    + alias4(((helper = (helper = helpers.creator || (depth0 != null ? depth0.creator : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"creator","hash":{},"data":data}) : helper)))
    + "</p>\n  </div>\n  </div>\n";
},"useData":true});
})();
