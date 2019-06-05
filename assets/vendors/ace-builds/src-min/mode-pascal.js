define("ace/mode/pascal_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,o){"use strict";var n=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,a=function(){this.$rules={start:[{caseInsensitive:!0,token:"keyword.control.pascal",regex:"\\b(?:(absolute|abstract|all|and|and_then|array|as|asm|attribute|begin|bindable|case|class|const|constructor|destructor|div|do|do|else|end|except|export|exports|external|far|file|finalization|finally|for|forward|goto|if|implementation|import|in|inherited|initialization|interface|interrupt|is|label|library|mod|module|name|near|nil|not|object|of|only|operator|or|or_else|otherwise|packed|pow|private|program|property|protected|public|published|qualified|record|repeat|resident|restricted|segment|set|shl|shr|then|to|try|type|unit|until|uses|value|var|view|virtual|while|with|xor))\\b"},{caseInsensitive:!0,token:["variable.pascal","text","storage.type.prototype.pascal","entity.name.function.prototype.pascal"],regex:"\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?(?=(?:\\(.*?\\))?;\\s*(?:attribute|forward|external))"},{caseInsensitive:!0,token:["variable.pascal","text","storage.type.function.pascal","entity.name.function.pascal"],regex:"\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?"},{token:"constant.numeric.pascal",regex:"\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"},{token:"punctuation.definition.comment.pascal",regex:"--.*$",push_:[{token:"comment.line.double-dash.pascal.one",regex:"$",next:"pop"},{defaultToken:"comment.line.double-dash.pascal.one"}]},{token:"punctuation.definition.comment.pascal",regex:"//.*$",push_:[{token:"comment.line.double-slash.pascal.two",regex:"$",next:"pop"},{defaultToken:"comment.line.double-slash.pascal.two"}]},{token:"punctuation.definition.comment.pascal",regex:"\\(\\*",push:[{token:"punctuation.definition.comment.pascal",regex:"\\*\\)",next:"pop"},{defaultToken:"comment.block.pascal.one"}]},{token:"punctuation.definition.comment.pascal",regex:"\\{",push:[{token:"punctuation.definition.comment.pascal",regex:"\\}",next:"pop"},{defaultToken:"comment.block.pascal.two"}]},{token:"punctuation.definition.string.begin.pascal",regex:'"',push:[{token:"constant.character.escape.pascal",regex:"\\\\."},{token:"punctuation.definition.string.end.pascal",regex:'"',next:"pop"},{defaultToken:"string.quoted.double.pascal"}]},{token:"punctuation.definition.string.begin.pascal",regex:"'",push:[{token:"constant.character.escape.apostrophe.pascal",regex:"''"},{token:"punctuation.definition.string.end.pascal",regex:"'",next:"pop"},{defaultToken:"string.quoted.single.pascal"}]},{token:"keyword.operator",regex:"[+\\-;,/*%]|:=|="}]},this.normalizeRules()};n.inherits(a,i),t.PascalHighlightRules=a}),define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],function(e,t,o){"use strict";var n=e("../../lib/oop"),i=e("./fold_mode").FoldMode,g=e("../../range").Range,a=t.FoldMode=function(){};n.inherits(a,i),function(){this.getFoldWidgetRange=function(e,t,o){var n=this.indentationBlock(e,o);if(n)return n;var i=/\S/,a=e.getLine(o),r=a.search(i);if(-1!=r&&"#"==a[r]){for(var s=a.length,l=e.getLength(),c=o,p=o;++o<l;){var u=(a=e.getLine(o)).search(i);if(-1!=u){if("#"!=a[u])break;p=o}}if(c<p){var d=e.getLine(p).length;return new g(c,s,p,d)}}},this.getFoldWidget=function(e,t,o){var n=e.getLine(o),i=n.search(/\S/),a=e.getLine(o+1),r=e.getLine(o-1),s=r.search(/\S/),l=a.search(/\S/);if(-1==i)return e.foldWidgets[o-1]=-1!=s&&s<l?"start":"","";if(-1==s){if(i==l&&"#"==n[i]&&"#"==a[i])return e.foldWidgets[o-1]="",e.foldWidgets[o+1]="","start"}else if(s==i&&"#"==n[i]&&"#"==r[i]&&-1==e.getLine(o-2).search(/\S/))return e.foldWidgets[o-1]="start",e.foldWidgets[o+1]="";return e.foldWidgets[o-1]=-1!=s&&s<i?"start":"",i<l?"start":""}}.call(a.prototype)}),define("ace/mode/pascal",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/pascal_highlight_rules","ace/mode/folding/coffee"],function(e,t,o){"use strict";var n=e("../lib/oop"),i=e("./text").Mode,a=e("./pascal_highlight_rules").PascalHighlightRules,r=e("./folding/coffee").FoldMode,s=function(){this.HighlightRules=a,this.foldingRules=new r,this.$behaviour=this.$defaultBehaviour};n.inherits(s,i),function(){this.lineCommentStart=["--","//"],this.blockComment=[{start:"(*",end:"*)"},{start:"{",end:"}"}],this.$id="ace/mode/pascal"}.call(s.prototype),t.Mode=s}),window.require(["ace/mode/pascal"],function(e){"object"==typeof module&&"object"==typeof exports&&module&&(module.exports=e)});