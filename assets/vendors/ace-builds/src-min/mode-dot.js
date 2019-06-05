define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,t,n){"use strict";var a=e("../range").Range,o=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var n=e.getLine(t).match(/^(\s*\})/);if(!n)return 0;var o=n[1].length,i=e.findMatchingBracket({row:t,column:o});if(!i||i.row==t)return 0;var r=this.$getIndent(e.getLine(i.row));e.replace(new a(t,0,t,o-1),r)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(o.prototype),t.MatchingBraceOutdent=o}),define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){"use strict";var o=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,r=function(){this.$rules={start:[{token:"comment.doc.tag",regex:"@[\\w\\d_]+"},r.getTagRule(),{defaultToken:"comment.doc",caseInsensitive:!0}]}};o.inherits(r,i),r.getTagRule=function(e){return{token:"comment.doc.tag.storage.type",regex:"\\b(?:TODO|FIXME|XXX|HACK)\\b"}},r.getStartRule=function(e){return{token:"comment.doc",regex:"\\/\\*(?=\\*)",next:e}},r.getEndRule=function(e){return{token:"comment.doc",regex:"\\*\\/",next:e}},t.DocCommentHighlightRules=r}),define("ace/mode/dot_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules","ace/mode/doc_comment_highlight_rules"],function(e,t,n){"use strict";var o=e("../lib/oop"),i=e("../lib/lang"),r=e("./text_highlight_rules").TextHighlightRules,a=(e("./doc_comment_highlight_rules").DocCommentHighlightRules,function(){var t=i.arrayToMap("strict|node|edge|graph|digraph|subgraph".split("|")),n=i.arrayToMap("damping|k|url|area|arrowhead|arrowsize|arrowtail|aspect|bb|bgcolor|center|charset|clusterrank|color|colorscheme|comment|compound|concentrate|constraint|decorate|defaultdist|dim|dimen|dir|diredgeconstraints|distortion|dpi|edgeurl|edgehref|edgetarget|edgetooltip|epsilon|esep|fillcolor|fixedsize|fontcolor|fontname|fontnames|fontpath|fontsize|forcelabels|gradientangle|group|headurl|head_lp|headclip|headhref|headlabel|headport|headtarget|headtooltip|height|href|id|image|imagepath|imagescale|label|labelurl|label_scheme|labelangle|labeldistance|labelfloat|labelfontcolor|labelfontname|labelfontsize|labelhref|labeljust|labelloc|labeltarget|labeltooltip|landscape|layer|layerlistsep|layers|layerselect|layersep|layout|len|levels|levelsgap|lhead|lheight|lp|ltail|lwidth|margin|maxiter|mclimit|mindist|minlen|mode|model|mosek|nodesep|nojustify|normalize|nslimit|nslimit1|ordering|orientation|outputorder|overlap|overlap_scaling|pack|packmode|pad|page|pagedir|pencolor|penwidth|peripheries|pin|pos|quadtree|quantum|rank|rankdir|ranksep|ratio|rects|regular|remincross|repulsiveforce|resolution|root|rotate|rotation|samehead|sametail|samplepoints|scale|searchsize|sep|shape|shapefile|showboxes|sides|size|skew|smoothing|sortv|splines|start|style|stylesheet|tailurl|tail_lp|tailclip|tailhref|taillabel|tailport|tailtarget|tailtooltip|target|tooltip|truecolor|vertices|viewport|voro_margin|weight|width|xlabel|xlp|z".split("|"));this.$rules={start:[{token:"comment",regex:/\/\/.*$/},{token:"comment",regex:/#.*$/},{token:"comment",merge:!0,regex:/\/\*/,next:"comment"},{token:"string",regex:"'(?=.)",next:"qstring"},{token:"string",regex:'"(?=.)',next:"qqstring"},{token:"constant.numeric",regex:/[+\-]?\d+(?:(?:\.\d*)?(?:[eE][+\-]?\d+)?)?\b/},{token:"keyword.operator",regex:/\+|=|\->/},{token:"punctuation.operator",regex:/,|;/},{token:"paren.lparen",regex:/[\[{]/},{token:"paren.rparen",regex:/[\]}]/},{token:"comment",regex:/^#!.*$/},{token:function(e){return t.hasOwnProperty(e.toLowerCase())?"keyword":n.hasOwnProperty(e.toLowerCase())?"variable":"text"},regex:"\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"}],comment:[{token:"comment",regex:"\\*\\/",next:"start"},{defaultToken:"comment"}],qqstring:[{token:"string",regex:'[^"\\\\]+',merge:!0},{token:"string",regex:"\\\\$",next:"qqstring",merge:!0},{token:"string",regex:'"|$',next:"start",merge:!0}],qstring:[{token:"string",regex:"[^'\\\\]+",merge:!0},{token:"string",regex:"\\\\$",next:"qstring",merge:!0},{token:"string",regex:"'|$",next:"start",merge:!0}]}});o.inherits(a,r),t.DotHighlightRules=a}),define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(e,t,n){"use strict";var o=e("../../lib/oop"),c=e("../../range").Range,i=e("./fold_mode").FoldMode,r=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};o.inherits(r,i),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var o=e.getLine(n);if(this.singleLineBlockCommentRe.test(o)&&!this.startRegionRe.test(o)&&!this.tripleStarBlockCommentRe.test(o))return"";var i=this._getFoldWidgetBase(e,t,n);return!i&&this.startRegionRe.test(o)?"start":i},this.getFoldWidgetRange=function(e,t,n,o){var i,r=e.getLine(n);if(this.startRegionRe.test(r))return this.getCommentRegionBlock(e,r,n);if(i=r.match(this.foldingStartMarker)){var a=i.index;if(i[1])return this.openingBracketBlock(e,i[1],n,a);var l=e.getCommentFoldRange(n,a+i[0].length,1);return l&&!l.isMultiLine()&&(o?l=this.getSectionRange(e,n):"all"!=t&&(l=null)),l}if("markbegin"!==t&&(i=r.match(this.foldingStopMarker))){a=i.index+i[0].length;return i[1]?this.closingBracketBlock(e,i[1],n,a):e.getCommentFoldRange(n,a,-1)}},this.getSectionRange=function(e,t){for(var n=e.getLine(t),o=n.search(/\S/),i=t,r=n.length,a=t+=1,l=e.getLength();++t<l;){var s=(n=e.getLine(t)).search(/\S/);if(-1!==s){if(s<o)break;var g=this.getFoldWidgetRange(e,"all",t);if(g){if(g.start.row<=i)break;if(g.isMultiLine())t=g.end.row;else if(o==s)break}a=t}}return new c(i,r,a,e.getLine(a).length)},this.getCommentRegionBlock=function(e,t,n){for(var o=t.search(/\s*$/),i=e.getLength(),r=n,a=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,l=1;++n<i;){t=e.getLine(n);var s=a.exec(t);if(s&&(s[1]?l--:l++,!l))break}if(r<n)return new c(r,o,n,t.length)}}.call(r.prototype)}),define("ace/mode/dot",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/matching_brace_outdent","ace/mode/dot_highlight_rules","ace/mode/folding/cstyle"],function(e,t,n){"use strict";var o=e("../lib/oop"),i=e("./text").Mode,r=e("./matching_brace_outdent").MatchingBraceOutdent,a=e("./dot_highlight_rules").DotHighlightRules,l=e("./folding/cstyle").FoldMode,s=function(){this.HighlightRules=a,this.$outdent=new r,this.foldingRules=new l,this.$behaviour=this.$defaultBehaviour};o.inherits(s,i),function(){this.lineCommentStart=["//","#"],this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(e,t,n){var o=this.$getIndent(t),i=this.getTokenizer().getLineTokens(t,e),r=i.tokens;i.state;if(r.length&&"comment"==r[r.length-1].type)return o;"start"==e&&(t.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/)&&(o+=n));return o},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id="ace/mode/dot"}.call(s.prototype),t.Mode=s}),window.require(["ace/mode/dot"],function(e){"object"==typeof module&&"object"==typeof exports&&module&&(module.exports=e)});