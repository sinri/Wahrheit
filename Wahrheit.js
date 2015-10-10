/*
 * Sinri Wahrheit Editor
 * =====================
 * Main JS File
 *
 * Put all elements into `#Wahrheit`.
 * Based on Markdown.
 * jQuery is needed.
 */

jQuery.fn.extend({
	insertAtCaret: function(myValue){
	  return this.each(function(i) {
	    if (document.selection) {
	      //For browsers like Internet Explorer
	      this.focus();
	      var sel = document.selection.createRange();
	      sel.text = myValue;
	      this.focus();
	    }
	    else if (this.selectionStart || this.selectionStart == '0') {
	      //For browsers like Firefox and Webkit based
	      var startPos = this.selectionStart;
	      var endPos = this.selectionEnd;
	      var scrollTop = this.scrollTop;
	      this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
	      this.focus();
	      this.selectionStart = startPos + myValue.length;
	      this.selectionEnd = startPos + myValue.length;
	      this.scrollTop = scrollTop;
	    } else {
	      this.value += myValue;
	      this.focus();
	    }
	  });
	}
});

var Wahrheit={
	//HTML
	html: [
      '<div>',
      '此处应有代码。',
      '</div>'
    ].join(''),
    //PARMETER
    baseurl: "./",
	//FUNCTION
	init:function(base_url){
		this.baseurl=base_url;
		var that=this;
		$.ajax({
		  url: this.baseurl+"Wahrheit.html",
		  // cache: false,
		  async:true,
		  success: function(html){
		  	var s='<script src="'+that.baseurl+'js/marked.js"></script>'+'<script src="'+that.baseurl+'js/highlight.pack.js"></script>'+html;
		  	// console.log(s);
		    $("#Wahrheit").html(s);
		    that.initHighlight();
		    that.textareaTabPress();
		  }
		});
	},
	initHighlight:function(){
		$(function() {
		    marked.setOptions({
		        langPrefix: ''
		    });
		    $('#WahrheitContentEditorTA').keyup(function() {
		        var src = $(this).val();
		        var html = marked(src);
		        $('#WahrheitContenViewerDiv').html(html);
		        $('pre code').each(function(i, block) {
		            hljs.highlightBlock(block);
		        });
		    });
		});
	},
	textareaTabPress:function(){
		$('#WahrheitContentEditorTA').keypress(function (e) {
		    if (e.keyCode == 9) {
		    	var myValue = "\t";
		    	var startPos = this.selectionStart;
		    	var endPos = this.selectionEnd;
		    	var scrollTop = this.scrollTop;
		    	this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos,this.value.length);
		    	this.focus();
		    	this.selectionStart = startPos + myValue.length;
		    	this.selectionEnd = startPos + myValue.length;
		    	this.scrollTop = scrollTop;

		    	e.preventDefault();
		    }
		});
		$('#WahrheitContentEditorTA').keydown(function (e) {
		    if (e.keyCode == 9) {
		    	var myValue = "\t";
		    	var startPos = this.selectionStart;
		    	var endPos = this.selectionEnd;
		    	var scrollTop = this.scrollTop;
		    	this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos,this.value.length);
		    	this.focus();
		    	this.selectionStart = startPos + myValue.length;
		    	this.selectionEnd = startPos + myValue.length;
		    	this.scrollTop = scrollTop;

		    	e.preventDefault();
		    }
		});
	},
	textareaSelection: function(){
	  var textComponent = document.getElementById('WahrheitContentEditorTA');
	  var selectedText;
	  var sel=null;
	  // IE version
	  if (document.selection != undefined)
	  {
	    textComponent.focus();
	    sel = document.selection.createRange();
	    console.log(sel);
	    selectedText = sel.text;
	  }
	  // Mozilla version
	  else if (textComponent.selectionStart != undefined)
	  {
	    var startPos = textComponent.selectionStart;
	    var endPos = textComponent.selectionEnd;
	    var selectedText = textComponent.value.substring(startPos, endPos)
	    sel = {
	    	startPos: startPos,
	    	endPos: endPos,
	    	text: selectedText,
	    }
	  }
	  return sel;
	},
	isSelectedTextEmpty: function(){
		var sel=this.textareaSelection();
		if(sel.text.length==0){
			return true;
		}else{
			return false;
		}
	},
	replaceSelectedTextInTA: function(prefix,keepSelectedText,suffix){
		var sel=this.textareaSelection();
		var old_value=$('#WahrheitContentEditorTA').val();
		var new_value=old_value.slice(0, sel.startPos)+prefix+(keepSelectedText?sel.text:'')+suffix+old_value.slice(sel.endPos);
		$('#WahrheitContentEditorTA').val(new_value);
	},
	insertInTA: function(text){
		$('#WahrheitContentEditorTA').insertAtCaret(text);
	},

	currentRowOfTA: function (){
		var myString=$('#WahrheitContentEditorTA').val();
		var caretPos=myString.substr(0, $('#WahrheitContentEditorTA').selectionStart).split("\n").length;
		// var caretPos = 53; // however you get it
		var start, end;

		for (start = caretPos; start >= 0 && myString[start] != "\n"; --start);
		for (end = caretPos; end < myString.length && myString[end] != "\n"; ++end);

		var line = myString.substring(start + 1, end - 1);

		console.log(myString);
		console.log(caretPos);
		console.log(line);

		return line;
	},

	// action
	insertHeader:function(level){
		var p="";
		for(var i=0;i<level;i++){
			p=p+'#';
		}
		p=p+" ";
		if(this.isSelectedTextEmpty()){
			var prefix='';
			if(this.currentRowOfTA().length!=0){
				prefix='\n\n';
			}
			this.insertInTA(prefix+p+'HEADER_'+level+'\n\n');
		}else{
			this.replaceSelectedTextInTA('\n\n'+p,true,'\n\n');
		}
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertStrong: function(){
		if(this.isSelectedTextEmpty()){
			this.insertInTA(' _'+'BOLD'+'_ ');
		}else{
			this.replaceSelectedTextInTA(' _',true,'_ ');
		}
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertItalic: function(){
		if(this.isSelectedTextEmpty()){
			this.insertInTA(' __'+'ITALIC'+'__ ');
		}else{
			this.replaceSelectedTextInTA(' __',true,'__ ');
		}
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertStrikethrough: function(){
		if(this.isSelectedTextEmpty()){
			this.insertInTA(' ~~'+'STRIKETHROUGH'+'~~ ');
		}else{
			this.replaceSelectedTextInTA(' ~~',true,'~~ ');
		}
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertInlineCode: function(){
		if(this.isSelectedTextEmpty()){
			this.insertInTA(' `'+'/* INLINE CODE */'+'` ');
		}else{
			this.replaceSelectedTextInTA(' `',true,'` ');
		}
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertCodeBlock: function(){
		if(this.isSelectedTextEmpty()){
			this.insertInTA('\n\n\t\/*\n\t * CODE BLOCK\n\t *\/\n\n');
		}else{
			this.replaceSelectedTextInTA('\n\n\t',true,'\n\n');
		}
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertQuoteBlock: function(){
		var p="> ";
		if(this.isSelectedTextEmpty()){
			var prefix='';
			if(this.currentRowOfTA().length!=0){
				prefix='\n\n';
			}
			this.insertInTA(prefix+p+'QUOTE'+'\n\n');
		}else{
			this.replaceSelectedTextInTA('\n\n'+p,true,'\n\n');
		}
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertLine: function(){
		this.insertInTA('\r\n\r\n----\r\n\r\n');
		$('#WahrheitContentEditorTA').trigger('keyup');
	},	
	insertList: function(sign){
		this.insertInTA('\n\n'+sign+' LIST_ITEM'+'\n'+sign+' LIST_ITEM'+'\n'+sign+' LIST_ITEM'+'\n\n');
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertTable: function(){
		var t = [
	      '|  X   |  A  |  B  |',
	      '|:----:|:----|----:|',
	      '|  X1  |  A1  |  B1  |',
	      '|  X2  |  A2  |  B2  |',
	      '|SUM of above|sum of A|sum of B|',
	    ].join('\n');
		this.insertInTA('\n\n'+t+'\n\n');
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertLink: function(text,LINK_URL){
		var t='['+text+']('+LINK_URL+')';
		this.insertInTA(' '+t+' ');
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertImage: function(text,IMG_URL, alt){
		var t='!['+text+']('+IMG_URL+' "'+alt+'")';
		this.insertInTA(' '+t+' ');
		$('#WahrheitContentEditorTA').trigger('keyup');
	},
	insertImageWithLink: function(text,IMG_URL,LINK_URL,alt){
		//[![TEXT](IMG_URL)](LINK_URL "TITLE")
		var t='[!['+text+']('+IMG_URL+')]('+LINK_URL+' "'+alt+'")';
		this.insertInTA(' '+t+' ');
		$('#WahrheitContentEditorTA').trigger('keyup');
	}
}
