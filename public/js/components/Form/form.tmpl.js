function pug_attr(t,e,n,f){return!1!==e&&null!=e&&(e||"class"!==t&&"style"!==t)?!0===e?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_classes(s,r){return Array.isArray(s)?pug_classes_array(s,r):s&&"object"==typeof s?pug_classes_object(s):s||""}
function pug_classes_array(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)(s=pug_classes(r[g]))&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
function pug_classes_object(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function formTmplTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"public\u002Fjs\u002Fcomponents\u002FForm\u002Fform.tmpl.pug":"h2 #{header}\n\nform.login_form\n    each i in inputs\n        input(name = i.name, type = i.type, placeholder = i.placeholder, class = i.className, value = i.value)\n\n\n\n\n"};
;var locals_for_with = (locals || {});(function (header, inputs) {;pug_debug_line = 1;pug_debug_filename = "public\u002Fjs\u002Fcomponents\u002FForm\u002Fform.tmpl.pug";
pug_html = pug_html + "\u003Ch2\u003E";
;pug_debug_line = 1;pug_debug_filename = "public\u002Fjs\u002Fcomponents\u002FForm\u002Fform.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = header) ? "" : pug_interp)) + "\u003C\u002Fh2\u003E";
;pug_debug_line = 3;pug_debug_filename = "public\u002Fjs\u002Fcomponents\u002FForm\u002Fform.tmpl.pug";
pug_html = pug_html + "\u003Cform class=\"login_form\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "public\u002Fjs\u002Fcomponents\u002FForm\u002Fform.tmpl.pug";
// iterate inputs
;(function(){
  var $$obj = inputs;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var i = $$obj[pug_index0];
;pug_debug_line = 5;pug_debug_filename = "public\u002Fjs\u002Fcomponents\u002FForm\u002Fform.tmpl.pug";
pug_html = pug_html + "\u003Cinput" + (pug_attr("class", pug_classes([i.className], [true]), false, false)+pug_attr("name", i.name, true, false)+pug_attr("type", i.type, true, false)+pug_attr("placeholder", i.placeholder, true, false)+pug_attr("value", i.value, true, false)) + "\u002F\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var i = $$obj[pug_index0];
;pug_debug_line = 5;pug_debug_filename = "public\u002Fjs\u002Fcomponents\u002FForm\u002Fform.tmpl.pug";
pug_html = pug_html + "\u003Cinput" + (pug_attr("class", pug_classes([i.className], [true]), false, false)+pug_attr("name", i.name, true, false)+pug_attr("type", i.type, true, false)+pug_attr("placeholder", i.placeholder, true, false)+pug_attr("value", i.value, true, false)) + "\u002F\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fform\u003E";}.call(this,"header" in locals_for_with?locals_for_with.header:typeof header!=="undefined"?header:undefined,"inputs" in locals_for_with?locals_for_with.inputs:typeof inputs!=="undefined"?inputs:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}