
'use strict';

const version = '2.3.0';
let currentTabId = '',
	time = 0,
	matchCount = 0,
	currentIndex = 0,
	currentType = '',
	currentSection = '',
	markElementSelector = '',
	markElement = '',
	optionPad = '',
	dFlagSupport = true,
	isScrolled = false,
	canBeNested = false,
	flagEveryElement = false,
	jsonEditor = null,
	noMatchTerms = [],
	marks = $(),
	startElements = $(),
	previousButton = $(`.previous`),
	nextButton = $(`.next`);

const currentLibrary = { jquery : false };

const types = {
	string_ : {
		options : [ 'element', 'className', 'exclude', 'separateWordSearch', 'accuracy', 'diacritics', 'synonyms', 'iframes', 'iframesTimeout', 'acrossElements', 'caseSensitive', 'ignoreJoiners', 'ignorePunctuation', 'wildcards', 'charSets', 'blockElementsBoundary', 'combinePatterns', 'cacheTextNodes', 'wrapAllRanges', 'shadowDOM', 'debug' ],
		editors : { 'queryString' : null, 'selectors' : null, 'testString' : null, 'exclude' : null, 'synonyms' : null, 'ignorePunctuation' : null, 'accuracyObject' : null, 'blockElements' : null, 'shadowStyle' : null },
		queryEditor : 'queryString',
		testEditorMode : 'text',
		customCodeEditor : null,
		isDirty : false
	},

	array : {
		options : [ 'element', 'className', 'exclude', 'separateWordSearch', 'accuracy', 'diacritics', 'synonyms', 'iframes', 'iframesTimeout', 'acrossElements', 'caseSensitive', 'ignoreJoiners', 'ignorePunctuation', 'wildcards', 'charSets', 'blockElementsBoundary', 'combinePatterns', 'cacheTextNodes', 'wrapAllRanges', 'shadowDOM', 'debug' ],
		editors : { 'queryArray' : null, 'selectors' : null, 'testString' : null, 'exclude' : null, 'synonyms' : null, 'ignorePunctuation' : null, 'accuracyObject' : null, 'blockElements' : null, 'shadowStyle' : null },
		queryEditor : 'queryArray',
		testEditorMode : 'text',
		customCodeEditor : null,
		isDirty : false
	},

	regexp : {
		options : [ 'element', 'className', 'exclude', 'iframes', 'iframesTimeout', 'acrossElements', 'ignoreGroups', 'separateGroups', 'blockElementsBoundary', 'wrapAllRanges', 'shadowDOM', 'debug' ],
		editors : { 'queryRegExp' : null, 'selectors' : null, 'testString' : null, 'exclude' : null, 'blockElements' : null, 'shadowStyle' : null },
		queryEditor : 'queryRegExp',
		testEditorMode : 'text',
		customCodeEditor : null,
		isDirty : false
	},

	ranges : {
		options : [ 'element', 'className', 'exclude', 'iframes', 'iframesTimeout', 'wrapAllRanges', 'shadowDOM', 'markLines', 'debug' ],
		editors : { 'queryRanges' : null, 'selectors' : null, 'testString' : null, 'exclude' : null, 'shadowStyle' : null },
		queryEditor : 'queryRanges',
		testEditorMode : 'text',
		customCodeEditor : null,
		isDirty : false
	}
};

const newOptions = ['blockElementsBoundary', 'combinePatterns', 'cacheTextNodes', 'wrapAllRanges', 'shadowDOM', 'markLines'];

const defaultOptions = {
	element : { value : 'mark', type : 'text' },
	className : { value : '', type : 'text' },
	exclude : { value : [], type : 'editor' },
	separateWordSearch : { value : true, type : 'checkbox' },
	diacritics : { value : true, type : 'checkbox' },
	accuracy : { value : 'partially', type : 'select' },
	charSets : { value : false, type : 'checkbox' },
	synonyms : { value : {}, type : 'editor' },
	iframes : { value : false, type : 'checkbox' },
	iframesTimeout : { value : 5000, type : 'number' },
	acrossElements : { value : false, type : 'checkbox' },
	caseSensitive : { value : false, type : 'checkbox' },
	ignoreJoiners : { value : false, type : 'checkbox' },
	ignorePunctuation : { value : [], type : 'editor' },
	wildcards : { value : 'disabled', type : 'select' },
	ignoreGroups : { value : 0, type : 'number' },
	combinePatterns : { value : false, type : 'checkbox' },    //combinePatterns default value is actually number - 10
	cacheTextNodes : { value : false, type : 'checkbox' },
	wrapAllRanges : { value : false, type : 'checkbox' },
	separateGroups : { value : false, type : 'checkbox' },
	blockElementsBoundary : { value : false, type : 'checkbox' },
	shadowDOM : { value : false, type : 'checkbox' },
	markLines : { value : false, type : 'checkbox' },
	debug : { value : false, type : 'checkbox' },
	log : { value : false, type : 'checkbox' },
};

$(document).ready(function() {
	let t0 = performance.now();

	detectLibrary();

	try { new RegExp('\\w', 'd'); } catch (e) { dFlagSupport = false; }

	registerEvents();
	tab.selectTab();
	tab.initTab();
	settings.setCheckboxes();
	tab.setDirty(false);
	tab.buildExampleSelector();
	tab.buildHtmlSelector();

	console.log('total time - ' + (performance.now() - t0));
});

const code = {
	// code.setText(text);
	setText : function(text) {
		tab.setTextMode(text);
	},

	// code.setHtml(iframes);
	setHtml : function(html) {
		tab.setHtmlMode(html, false);
		tab.setTextMode(null);
	},

	// code.setListener('keyup', runCode);
	// allows adding several events to the search editor.
	setListener : function(event, fn) {
		const elem = document.querySelector(tab.getSearchEditorInfo().selector),
			data = elem.getAttribute('data-event');

		if ( !data || !data.split(' ').includes(event)) {
			elem.addEventListener(event, fn);
			elem.setAttribute('data-event', (data === null ? '' : data + ' ') + event);
		}
	},

	setSelectors : function(selectors, all = false) {
		const info = tab.getSelectorsEditorInfo();
		if (info.editor) {
			info.editor.updateCode(selectors);
			$(info.all).prop('checked', all)
		}
	},
};

const tab = {

	initTab : function() {
		const saved = this.setLoadButton();

		if ( !this.isInitialize()) {
			this.initializeEditors();

			if (settings.loadDefault || !saved) {
				importer.resetOptions();

				this.loadSearchParameter();
				this.loadDefaultHtml();
				runCode(true);

			} else {
				importer.loadTab();
			}
		}

		this.setVisibility();
	},

	selectTab : function(type) {
		if ( !type) {
			type = settings.loadValue('tabType');
			if ( !type) type = 'string_';
		}

		$('body.playground>header .mark-type li').removeClass('selected');
		$('body.playground>header .mark-type li[data-type=' + type + ']').addClass('selected');

		settings.saveValue('tabType', type);
		currentType = type;
		currentSection = `.playground section.${currentType}`;
		optionPad = `${currentSection}>.right-column`;

		if (currentType === 'array') {
			this.buildSelector(`${currentSection} .queryArray select`, wordArrays);
		}

		codeBuilder.initCodeSnippet();
		this.clear();

		settings.load();

		currentTabId = `advanced_section_${currentType}`;

		$('.file-form .file-name').val(getFileName());
		$('header .save').toggleClass('dirty', types[currentType].isDirty);

		previousButton = $(`${currentSection} .testString .previous`);
		nextButton = $(`${currentSection} .testString .next`);
		previousButton.css('opacity', 0.5);
		nextButton.css('opacity', 0.5);

		isScrolled = false;
	},

	setVisibility : function() {
		showInstructions(false);

		$(`${currentSection} .dependable`).addClass('hide');
		$(`${currentSection} .advanced:not(.dependable)`).removeClass('hide');

		setIframesTimeout($(`${optionPad} .iframes input`)[0]);

		$('body.playground>main>article>section').addClass('hide');
		$(currentSection).removeClass('hide');
		$('.internal-code').addClass('hide');

		setShadowDOMStyle($(`${optionPad} .shadowDOM>input`)[0]);

		toggleTestButton($(`.setting-form .show-test-btn>input`)[0]);

		switch (currentType) {
			case 'string_' :
				setAccuracy(this.getElement('accuracy', 'select')[0]);
				setAcrossElementsDependable(this.getElement('acrossElements', 'input')[0]);
				setCacheAndCombine(this.getElement('separateWordSearch', 'input')[0]);
				break;

			case 'array' :
				setAccuracy(this.getElement('accuracy', 'select')[0]);
				setAcrossElementsDependable(this.getElement('acrossElements', 'input')[0]);

				if (isVisible('combinePatterns')) {
					setCombineNumber(this.getElement('combinePatterns', 'input')[0]);
				}
				setSeparateWordValue(this.getElement('separateWordSearch', 'input')[0]);
				break;

			case 'regexp' :
				setBlockElementsBoundary(this.getElement('acrossElements', 'input')[0]);
				setSeparateGroupsDependable(this.getElement('separateGroups', 'input')[0]);
				break;

			default : break;
		}
	},

	buildHtmlSelector : function() {
		const options = this.buildSelectorOptions(defaultHtmls);

		$('select.default-html').html(options);
	},

	buildExampleSelector : function() {
		const options = this.buildSelectorOptions(examples);

		$('header select#examples').html(options);
	},

	buildSelectorOptions : function(obj) {
		let options = '<option value="">' + obj['name'] + '</option>';

		for (const key in obj) {
			if (key !== 'name') {
				let title = key.replace(/^[a-z]/, m => m.toUpperCase()).replace(/[a-z](?=[A-Z])/g, '$& ');
				title = title.replace(/( [A-Z])([a-z]+)/g, (m, gr1, gr2) => gr1.toLowerCase() + gr2);
				options += `<option value="${key}">${title}</option>`;
			}
		}
		return options;
	},

	buildSelector : function(selector, obj) {
		let options = '';

		for (const key in obj) {
			if (key !== 'name') {
				const value = key.startsWith('default') ? `['${obj[key].toString().split(',').join("', '")}']` : `${obj.name}.${key}`;
				options += `<option value="${value}">${obj.name}.${key}</option>`;
			}
		}
		$(selector).html(options);
	},

	switchElements : function(elem, selector, negate) {
		const div = $(`${optionPad} ${selector}`),
			checked = $(elem).prop('checked');

		if (negate) {
			if (checked) div.addClass('hide');
			else div.removeClass('hide');

		} else {
			if (checked) div.removeClass('hide');
			else div.addClass('hide');
		}
	},

	loadDefaultHtml : function(force) {
		const testEditor = this.getTestEditor();

		if (force || testEditor.toString().trim() === '') {
			const elem = this.getTestElement();
			elem.innerHTML = defaultHtmls['lorem'];

			types[currentType].testEditorMode = 'text';
			this.highlightButton('.text');
		}
	},

	loadSearchParameter : function() {
		const info = this.getSearchEditorInfo();

		if (info.editor.toString().trim() === '') {
			let searchParameter = searchParameters[currentType];

			if (searchParameter) {
				if (currentType === 'array' || currentType === 'ranges') {
					searchParameter = JSON.stringify(searchParameter);
				}
				info.editor.updateCode(searchParameter);
			}
		}
	},

	setHtmlMode : function(content, highlight, removeMarks = false) {
		if (types[currentType].testEditorMode === 'html' && !content) return;

		types[currentType].testEditorMode = 'html';

		let html = content || this.getInnerHTML();

		if (html) {
			const div = this.destroyTestEditor();
			if ( !div) return;

			if (removeMarks) {
				html = util.removeMarks(html);
			}

			if (highlight) {
				highlighter.highlightRawHtml(div, html);

			} else {
				// .innerText removes/normalizes white spaces
				div.innerHTML = util.entitize(html);
			}
			this.initializeEditors();

		} else {
			this.getTestEditor().updateCode('');
		}

		this.highlightButton('.html');
	},

	setTextMode : function(content, highlight = false) {
		if (types[currentType].testEditorMode === 'text' && !content) return;

		types[currentType].testEditorMode = 'text';

		const text = content || this.getTestElement().innerText;

		if (text) {
			const div = this.destroyTestEditor();
			if ( !div) return;

			div.innerHTML = text;
			this.initializeEditors();

			if (highlight) {
				runCode();
			}

		} else {
			this.getTestEditor().updateCode('');
		}

		this.highlightButton('.text');
	},

	highlightButton : function(selector) {
		const button = $(`${currentSection} .testString ${selector}`);

		$(`${currentSection} .testString button`).removeClass('pressed');
		button.addClass('pressed');
	},

	initializeEditors : function() {
		const obj = types[currentType];

		for (const key in obj.editors) {
			if (obj.editors[key] === null) {
				if (key === 'testString') {
					obj.editors[key] = this.initTestEditor(obj.editors[key]);

				} else {
					let selector = `${currentSection} .${key} .editor`;
					obj.editors[key] = this.initEditor(obj.editors[key], selector);
				}
			}
		}
	},

	defineCustomElements : function() {
		customElements.define('shadow-dom-' + currentType, class extends HTMLElement {
			constructor() {
				super();
				const root = this.attachShadow({ mode : 'open' });
				root.innerHTML = shadowStyle + '<div class="editor"></div>';
			}
		});
	},

	initTestEditor : function(editor) {
		if ( !document.querySelector('shadow-dom-' + currentType).shadowRoot) {
			this.defineCustomElements();
		}

		const elem = this.getTestElement();
		elem.addEventListener('scroll', testContainerScrolled);

		editor = CodeJar(elem, null, { tab : '  ' });
		editor.onUpdate((code, event) => this.updateTestEditor(code, event));
		return editor;
	},

	getTestElement : function() {
		const root = document.querySelector('shadow-dom-' + currentType).shadowRoot;
		return root.querySelector('.editor');
	},

	initEditor : function(editor, selector) {
		editor = CodeJar(document.querySelector(selector), null, { tab : '  ' });
		//editor = CodeJar(document.querySelector(selector), null, { tab : '\t' });
		editor.onUpdate(code => this.onUpdateEditor(code, selector));
		return editor;
	},

	isInitialize : function() {
		const obj = types[currentType];
		for (const key in obj.editors) {
			if (obj.editors[key] !== null) return true;
		}
		return false;
	},

	// for performance reason it destroys an old editor, and replaces the old editor div element by the new one
	destroyTestEditor : function() {
		tab.setEditableAttribute(false);

		const obj = types[currentType];
		if (obj.editors.testString !== null) {
			obj.editors.testString.destroy();
			obj.editors.testString = null;
		}

		const elem = this.getTestElement();
		if (elem) {
			elem.removeEventListener('scroll', testContainerScrolled);

			let div = document.createElement('div');
			div.className = 'editor';
			elem.parentNode.replaceChild(div, elem);
			return div;
		}
		return null;
	},

	updateTestEditor : function(code, event) {
		if (event && (event.type === 'paste' || event.type === 'drop')) {
			if (types[currentType].testEditorMode === 'html') {
				this.setHtmlMode(importer.sanitizeHtml(code), true);
			}
		}
		this.setDirty(true);
	},

	onUpdateEditor : function(code, selector) {
		$(selector).parent('div').find('button.clear').toggleClass('hide', code.length === 0);

		this.setDirty(true);
	},

	updateCustomCode : function(content) {
		const info = this.getCodeEditorInfo();
		info.editor.updateCode(content);

		$(info.selector).parent().attr('open', true);
		hljs.highlightElement($(info.selector)[0]);
	},

	getSelectorsEditorInfo : function() {
		const obj = types[currentType],
			checkbox = `${currentSection} .selectors .selector-all>input`,
			selector = `${currentSection} .selectors .editor`,
			editor = obj.editors['selectors'];

		return { selector, editor, all : checkbox };
	},

	getSearchEditorInfo : function() {
		const obj = types[currentType],
			selector = `${currentSection} .${obj.queryEditor} .editor`,
			editor = obj.editors[obj.queryEditor];

		return { selector, editor };
	},

	getCodeEditorInfo : function() {
		const obj = types[currentType],
			selector = `${optionPad} .customCode .editor`,
			editor = obj.customCodeEditor;

		if ( !editor) {
			types[currentType].customCodeEditor = tab.initEditor(editor, selector);
		}
		return { selector, editor : types[currentType].customCodeEditor };
	},

	getTestEditor : function() {
		const editor = types[currentType].editors.testString;
		if ( !editor) {
			types[currentType].editors.testString = tab.initTestEditor(editor);
		}
		return types[currentType].editors.testString;
	},

	getOptionEditor : function(option) {
		return types[currentType].editors[option];
	},

	clear : function(keep) {
		$('.results code').empty();
		$('.internal-code code').empty();
		if ( !keep) $('.generated-code code').empty();
		$('section .editor, header li').removeClass('error warning');
		marks = $();
		startElements = $();
	},

	setEditableAttribute : function(on) {
		const elem = this.getTestElement();
		$(elem).attr('contenteditable', on);
	},

	setLoadButton : function() {
		const value = settings.loadValue(currentTabId),
			button = $('header button.load');

		if (value) button.removeClass('inactive');
		else button.addClass('inactive');

		return value;
	},

	setDirty : function(value) {
		types[currentType].isDirty = value;
		$('header .save').toggleClass('dirty', value);
	},

	getNumericalValue : function(option, defaultValue) {
		return parseInt($(`${optionPad} .${option} input`).val().trim()) || defaultValue;
	},

	getElement : function(option, name) {
		return $(`${optionPad} .${option} ${name}`)
	},

	isChecked : function(option) {
		return this.getElement(option, 'input').prop('checked');
	},

	getInnerHTML : function() {
		const elem = tab.getTestElement();

		if (tab.isChecked('iframes') || tab.isChecked('shadowDOM')) {
			return this.innerHTML(elem);
		}
		return elem.innerHTML;
	},

	innerHTML : function(root) {
		const array = [],
			stack = [],
			iframe = tab.isChecked('iframes'),
			shadow = tab.isChecked('shadowDOM');

		const pushToStack = parent => {
			if (parent.hasChildNodes()) {
				for (let i = parent.childNodes.length - 1; i >= 0; i--) {
					const node = parent.childNodes[i];

					if (node.nodeType === Node.ELEMENT_NODE && !util.isVoidElement(node)) {
						stack.push({ node : null, closeTag : `</${node.nodeName.toLowerCase()}>` });
					}
					stack.push({ node : node, closeTag : null });
				}
			}
		};

		const writeElement = node => {
			array.push('<' + node.nodeName.toLowerCase());

			if (node.hasAttributes()) {
				for (let i = 0; i < node.attributes.length; i++) {
					const attr = node.attributes[i];
					array.push(` ${attr.name}="${attr.value}"`);
				}
			}
			array.push('>');
		};

		pushToStack(root);

		while (stack.length > 0) {
			const obj = stack.pop();

			if (obj.closeTag) {
				array.push(obj.closeTag);
				continue;
			}

			let node = obj.node;

			if (node.nodeType === Node.ELEMENT_NODE) {
				writeElement(node);

				if (shadow && node.shadowRoot && node.shadowRoot.mode === 'open') {
					array.push('\n#shadow-root (open)\n');
					pushToStack(node.shadowRoot);

				} else if (iframe && node.nodeName.toLowerCase() === 'iframe') {
					try {
						let body, doc = node.contentWindow.document;

						if (doc && (body = doc.querySelector('body'))) {
							pushToStack(body);
						}
					} catch (e) { }

				} else {
					pushToStack(node);
				}

			} else if (node.nodeType === Node.TEXT_NODE) {
				array.push(util.entitize(node.textContent));
			}
		}
		return array.join('');
	}
};

// also DOM 'onchange' event
function setSeparateGroupsDependable(elem) {
	tab.switchElements(elem, '.ignoreGroups', true);

	tab.switchElements(elem, '.wrapAllRanges');
}

// also DOM 'onchange' event
function setAcrossElementsDependable(elem) {
	$(`${optionPad} .wrapAllRanges`).addClass('hide');

	tab.switchElements(elem, '.acrossElementsValue');    // required

	setBlockElementsBoundary(elem);
}

// also DOM 'onchange' event
function setBlockElementsBoundary(elem) {
	$(`${optionPad} .blockElementsBoundary`).addClass('hide');
	$(`${optionPad} .blockElements`).addClass('hide');

	tab.switchElements(elem, '.blockElementsBoundary');

	if (tab.isChecked('acrossElements') && isVisible('blockElementsBoundary')) {
		setBlockElements($(`${optionPad} .blockElementsBoundary input`)[0]);
	}
}

// DOM 'onchange' event
function setBlockElements(elem) {
	tab.switchElements(elem, '.blockElements');
}

// also DOM 'onchange' event
function setCacheAndCombine(elem) {
	$(`${optionPad} .combineNumber`).addClass('hide');
	$(`${optionPad} .wrapAllRanges`).addClass('hide');

	tab.switchElements(elem, '.combinePatterns');
	tab.switchElements(elem, '.cacheTextNodes');
	tab.switchElements(elem, '.separateWordValue');

	if (isVisible('combinePatterns')) {
		setCombineNumber($('#string_-combinePatterns')[0]);
	}
}

// also DOM 'onchange' event
function setSeparateWordValue(elem) {
	tab.switchElements(elem, '.separateWordValue');
}

// also DOM 'onchange' event
function setCombineNumber(elem) {
	tab.switchElements(elem, '.combineNumber');
}

// also DOM 'onchange' event
function setShadowDOMStyle(elem) {
	tab.switchElements(elem, '.shadowStyle');
}

// also DOM 'onchange' event
function setAccuracy(elem) {
	const article = 'article.options-info',
		div = $(`${optionPad} .accuracyObject`).addClass('hide'),
		exactly = $(`${optionPad} .accuracyObject .accuracy-exactly`).addClass('hide'),
		startsWith = $(`${optionPad} .accuracyObject .accuracy-startsWith`).addClass('hide'),
		complementary = $(`${optionPad} .accuracyObject .accuracy-complementary`).addClass('hide');

	$(`${article} .accuracy-exactly, ${article} .accuracy-startsWith, ${article} .accuracy-complementary`).addClass('hide');

	if (isAccuracyValue(elem.value)) {
		div.removeClass('hide');

		const editor = tab.getOptionEditor('accuracyObject');
		let text = editor.toString();

		if (text.trim()) {
			const value = getSetAccuracyValue(text);
			if (value !== elem.value) {
				text = getSetAccuracyValue(text, elem.value);
				editor.updateCode(text);
			}
		}
	}

	if (elem.value === 'exactly') {
		exactly.removeClass('hide');
		$(`${article} .accuracy-exactly`).removeClass('hide');

	} else if (elem.value === 'startsWith') {
		startsWith.removeClass('hide');
		$(`${article} .accuracy-startsWith`).removeClass('hide');

	} else if (elem.value === 'complementary') {
		complementary.removeClass('hide');
		$(`${article} .accuracy-complementary`).removeClass('hide');
	}
}

function getSetAccuracyValue(text, accuracy) {
	const reg = /(^\s*\{\s*[^:]+:\s*(['"`]))([^'"`]+)(\2.+)/;
	return text.replace(reg, accuracy ? '$1' + accuracy + '$4' : '$3');
}

function isAccuracyValue(value) {
	return value === 'exactly' || value === 'complementary' || value === 'startsWith';
}

// DOM 'onchange' event
function selectHtml(elem) {
	const title = $(elem).val();
	let content = defaultHtmls[title];

	tab.setHtmlMode(content, false);
	tab.setTextMode(null);
}

// also DOM 'onchange' event
function setIframesTimeout(elem) {
	tab.switchElements(elem, '.iframesTimeout');
}

// DOM 'onchange' event
function selectDefaultHtml(elem) {
	const title = $(elem).val();
	let content = defaultHtmls[title];

	tab.setHtmlMode(content, false);
	tab.setTextMode(null);
}

// DOM 'onchange' event
function selectExample(elem) {
	const title = $(elem).val();
	let str = examples[title];

	if (str) {
		if (settings.showWarning && types[currentType].isDirty) {
			if ( !window.confirm("Are you sure you want to load the example and lose the changes made in the tab?")) {
				return;
			}
		}
		if (title === 'iframes' && !/^https?:\/+/.test(location.href)) {
			str = str.replace(/"customCode": *"/, '$&// Note that iframes example can only be run on a sever.\\n');
		}
		importer.loadJson(str);
	}
}

// DOM 'onchange' event
function selectArray(elem) {
	const info = tab.getSearchEditorInfo();
	info.editor.updateCode($(elem).val());
}

// DOM 'onclick' event
function setTextMode(e) {
	tab.setTextMode(null, !(e.ctrlKey || e.metaKey));
}

// DOM 'onclick' event
function setHtmlMode(e) {
	const keyPress = e.ctrlKey || e.metaKey;
	tab.setHtmlMode(null, !keyPress, keyPress);
}

// DOM 'onclick' event
function loadDefaultHtml() {
	tab.loadDefaultHtml();
}

// DOM 'onchange' event
function toggleTestButton(elem) {
	elem.parentNode.querySelector('button').classList.toggle('hide', !$(elem).prop('checked'));
}

// also DOM 'onclick' event
function showInstructions(instr) {
	const elem = $('#playground-instructions');
	instr = instr && elem.css('display') === 'block' ? !instr : instr;

	const article = instr ? 'none' : 'block',
		instructions = instr ? 'block' : 'none';

	$('article#playground-article').css('display', article);
	elem.css('display', instructions);
}

// DOM 'onclick' event
function save() {
	const json = Json.buildJson();

	if (json) {
		settings.saveValue(currentTabId, json);
		tab.setLoadButton();
	}
	tab.setDirty(false);
}

// DOM 'onclick' event
function load() {
	if (types[currentType].isDirty) {
		if ( !window.confirm("Are you sure you want to reload the current tab and lose the changes made in it?")) {
			return;
		}
	}
	importer.loadTab();
}

// DOM 'onclick' event
function exportJson() {
	const json = Json.buildJson(true);

	if (json) {
		jsonEditor.updateCode(json);
		$('button.import-json').attr('disabled', false);
	}
}

// DOM 'onclick' event
function importJson() {
	let str = jsonEditor.toString().trim();
	importer.loadJson(str);
}

// DOM 'onclick' event
function clearCodeEditor(elem) {
	const editor = types[currentType].customCodeEditor;
	if (editor) {
		editor.updateCode('');
	}
	$(elem).addClass('hide');

	tab.clear();
	codeBuilder.build('js-jq');
	tab.setDirty(true);
}

// DOM 'onclick' event
function clearJsonEditor() {
	jsonEditor.updateCode('');
	$('button.import-json').attr('disabled', true);
}

// DOM 'onclick' event
function clearEditor(elem) {
	const parent = elem.parentNode.parentNode,
		className = parent.className.replace(/\b(?:advanced|dependable|hide)\b/g, '').trim(),
		obj = types[currentType],
		editor = obj.editors[className];

	if (editor) {
		if (className === 'testString') {
			tab.destroyTestEditor();
			tab.initializeEditors();

		} else {
			editor.updateCode('');
		}

		tab.setDirty(true);
	}
	if (className !== obj.queryEditor && className !== 'testString') {
		$(elem).addClass('hide');
	}
}

const importer = {

	loadTab : function() {
		const str = settings.loadValue(currentTabId);
		if (str) {
			this.loadJson(str);

		} else {
			log('\nSomething is wrong with the local storage', true);
		}
	},

	loadJson : function(str) {
		if (str) {
			const json = Json.parseJson(str);
			if ( !json) {
				return;
			}

			const type = json.section['type'];

			if (type && types[type]) {
				tab.selectTab(type);
				tab.initializeEditors();
				this.setOptions(json);
				tab.setVisibility();

			} else {
				log('\nSomething is wrong with the json', true);
			}
		}
	},

	resetOptions : function() {
		const obj = types[currentType];

		obj.options.every(option => {
			const selector = `${optionPad} .${option}`,
				opt = defaultOptions[option];

			if (opt) {
				switch (opt.type) {
					case 'checkbox' :
						if (option === 'separateWordSearch') {
							tab.getElement('separateWordValue', 'select').val('true');

						} else if (option === 'acrossElementsValue') {
							tab.getElement('acrossElementsValue', 'select').val('true');
						}
						$(selector + ' input').prop('checked', opt.value);
						break;

					case 'text' :
					case 'number' :
						$(selector + ' input').val(opt.value);
						break;

					case 'select' :
						$(selector + ' select').val(opt.value);
						break;

					default : break;
				}
			}
			return true;
		});

		for (const key in obj.editors) {
			for (const key in obj.editors) {
				if (obj.editors[key]) obj.editors[key].updateCode('');
			}
		}

		const editor = types[currentType].customCodeEditor;
		if (editor) {
			editor.updateCode('');
			$(`${currentSection} .customCode details`).attr('open', false);
			$(`${currentSection} .customCode button.clear`).addClass('hide');
		}
	},

	setOptions : function(json) {
		const obj = types[currentType],
			across = tab.isChecked('acrossElements'),
			textMode = obj.testEditorMode === 'text';

		let editor, saved;
		this.resetOptions();

		obj.options.every(option => {
			const selector = `${optionPad} .${option}`,
				opt = defaultOptions[option];

			if (opt) {
				saved = json.section[option];

				if (isNullOrUndefined(saved)) {
					saved = opt.value;
				}

				switch (opt.type) {
					case 'checkbox' :
						const notBoolean = saved !== true && saved !== false;

						if (option === 'separateWordSearch' && notBoolean) {
							tab.getElement('separateWordValue', 'select').val(saved || 'true');
							saved = true;

						} else if (option === 'acrossElements' && notBoolean) {
							tab.getElement('acrossElementsValue', 'select').val(saved || 'true');
							saved = true;

						} else if (option === 'combinePatterns') {
							tab.getElement('combineNumber', 'input').val(parseInt(saved) || 10);
							saved = !isNullOrUndefined(json.section[option]);

						} else if (option === 'shadowDOM' && notBoolean) {
							const editor = tab.getOptionEditor('shadowStyle');
							editor.updateCode(saved);
							saved = true;

						} else if (option === 'blockElementsBoundary' && notBoolean) {
							const editor = tab.getOptionEditor('blockElements');
							editor.updateCode(saved);
							saved = true;
						}
						$(selector + ' input').prop('checked', saved);
						break;

					case 'text' :
						$(selector + ' input').val(saved);
						break;

					case 'number' :
						$(selector + ' input').val(saved);
						break;

					case 'select' :
						if (option === 'accuracy' && saved !== 'partially' && !isAccuracyValue(saved)) {
							const editor = tab.getOptionEditor('accuracyObject');
							editor.updateCode(saved);

							const value = getSetAccuracyValue(saved);
							saved = isAccuracyValue(value) ? value : 'partially';
						}
						$(selector + ' select').val(saved);
						break;

					default : break;
				}
			}
			return true;
		});

		for (const key in obj.editors) {
			if (key === 'accuracyObject' || key === 'blockElements' || key === 'shadowStyle') continue;
			const editor = obj.editors[key];
			saved = json.section[key];

			if (isNullOrUndefined(saved)) {
				editor.updateCode('');

			} else if (key === 'testString') {
				const mode = isNullOrUndefined(saved.mode) || saved.mode !== 'text' ? 'html' : saved.mode;
				const content = isNullOrUndefined(saved.content) ? '' : this.sanitizeHtml(saved.content);

				if (mode === 'text') {
					tab.setTextMode(content);

				} else {
					if (content === 'defaultHtml') {
						tab.loadDefaultHtml(true);

					} else {
						if (/^defaultHtmls\[(['"])\w+\1\]$/.test(content)) {
							const match = /^defaultHtmls\[['"](\w+)['"]\]([^]*)/.exec(content);
							tab.setHtmlMode(defaultHtmls[match[1]] + (match[2] || ''), false);

						} else {
							tab.setHtmlMode(content, false);
						}
						tab.setTextMode(null);
					}
				}

			} else {
				if (key === 'queryArray') {
					const querySelect = `${currentSection} .queryArray select`;
					$(querySelect).val(saved);

				} else if (key === 'selectors') {
					const all = json.section['selectorAll'];
					if ( !isNullOrUndefined(all)) {
						$(`${currentSection} .selectors .selector-all>input`).prop('checked', all);
					}
				}
				editor.updateCode(saved);
			}
		}

		if ( !isNullOrUndefined(saved = json.section['customCode'])) {
			tab.updateCustomCode(saved);
		}

		if (textMode) {
			tab.setTextMode(null);
		}

		tab.setDirty(false);
	},

	sanitizeHtml : function(str) {
		const doc = new DOMParser().parseFromString(str, "text/html"),
			iterator = document.createNodeIterator(doc.documentElement, NodeFilter.SHOW_ALL),
			report = {};

		let node;
		while (node = iterator.nextNode()) {
			if (/^(?:head|script|style|link|meta|#comment)$/i.test(node.nodeName)) {
				node.parentNode.removeChild(node);
				add(`removed ${node.nodeType === 1 ? 'element' : ''} '${node.nodeName.toLowerCase()}'`);
				continue;
			}

			if (node.nodeType === 1) {
				checkAttributes(node);
			}
		}

		function checkAttributes(elem) {
			for (let i = 0; i < elem.attributes.length; i++) {
				const attr = elem.attributes[i],
					name = attr.name.toLowerCase();

				if (name === 'href' || name === 'src' && elem.nodeName.toLowerCase() !== 'iframe' || name === 'srcset') {
					const val = decodeURIComponent(attr.value);

					if (/^(?!#).+/i.test(val)) {
						attr.value = '#';
						add(`replaced '${name}' attribute value by '#'`);
					}

				} else if (/\bjavascript(?::|&colon;)/i.test(attr.value)) {
					elem.removeAttribute(attr.name);
					add(`removed ${name} attribute containing 'javascript:'`);

				} else if (name === 'style') {
					if (/\burl\s*\(/i.test(attr.value)) {
						elem.removeAttribute(attr.name);
						add(`removed ${name} attribute containing 'url'`);
					}

				} else if (/^xlink:href/i.test(name)) {
					attr.value = '#';
					add(`replaced '${name}' attribute value by '#'`);

				} else if (/^on[a-z]+/i.test(name)) {    // on event attribute
					elem.removeAttribute(attr.name);
					add(`removed '${name}' attribute`);
				}
			}
		}

		function add(msg) {
			report[msg] = !report[msg] ? 1 : report[msg] + 1;
		}

		console.log(toText(report, 'Html sanitizer report:', ' Ok'));

		const html = doc.body.innerHTML;

		// restores starting white spaces if any - vital for ranges
		const spcReg = /^\s+/y;
		if (spcReg.test(str) && !/^\s+/.test(html)) {
			return str.substring(0, spcReg.lastIndex) + html;
		}

		return html;
	}
};

function markArray() {
	return currentType === 'array' || currentType === 'string_' && tab.isChecked('separateWordSearch');
}

function setVariables() {
	matchCount = 0;
	noMatchTerms = [];
	canBeNested = (currentType === 'regexp' || currentType === 'ranges') && tab.isChecked('wrapAllRanges');
	flagEveryElement = currentType !== 'ranges' && !tab.isChecked('acrossElements');

	const className = tab.getElement('className', 'input').val().trim();
	markElement = tab.getElement('element', 'input').val().trim().toLowerCase() || 'mark';
	markElementSelector = `${markElement}[data-markjs]${className ? '.' + className : ''}`;
}

// DOM 'onclick' event
function unmarkMethod(elem) {
	codeBuilder.build('js-jq');
}

// also DOM 'onclick' event
function runCode(reset) {
	tab.clear();

	if (reset) {
		currentIndex = 0;
	}

	const editor = types[currentType].customCodeEditor;

	if (editor && editor.toString().trim()) {
		const code = codeBuilder.build('internal');

		if (code) {
			setVariables();
			// disable contenteditable attribute for performance reason
			tab.setEditableAttribute(false);

			log('Evaluating the whole code\n');

			let options;
			try { options = new Function('"use strict"; ' + code)(); } catch (e) {
				log('Failed to evaluate the code\n' + e.message, true);
				tab.setEditableAttribute(true);
				console.error(e.message);
				console.log(e.stack);
			}

			$('.internal-code').removeClass('hide');
			$('.internal-code code').text(code);

			hljs.highlightElement($(`${optionPad} .customCode .editor`)[0]);
			hljs.highlightElement($('.internal-code code')[0]);

			const val = settings.loadValue('internal_code');
			if (val && val === 'opened') {
				$("#internal-code").attr('open', true);
			}
			// returning an object 'options' is only necessary for testing purposes
			return options;
		}

	} else {
		highlighter.highlight();

		const val = settings.loadValue('generated_code');
		if (val && val === 'opened') {
			$(".generated-code details").attr('open', true);
		}
	}
}

const codeBuilder = {
	comment : '// your code before',
	defaultSnippet : `\n<<markjsCode>> // don't remove this line\n\nfunction filter() {\n  return true;\n}\n\nfunction each() {}\n\nfunction done() {}`,
	snippet : '',

	build : function(kind) {
		const jsCode = this.buildCode('js');
		if ( !jsCode) return '';

		const jqCode = this.buildCode('jq');

		$('.generated-code pre>code').text(jsCode + '\n\n' + jqCode);

		hljs.highlightElement($('.generated-code pre>code')[0]);

		$('.internal-code').addClass('hide');

		return this.buildCode(kind);
	},

	buildCode : function(kind) {
		const info = tab.getSearchEditorInfo(),
			unmark = kind === 'internal' || $('.unmark-method input').prop('checked'),
			optionCode = this.buildOptions(kind, unmark);

		let unmarkOpt = '',
			code = '',
			str = '',
			text;

		const name = tab.getElement('element', 'input').val().trim();
		if (name && name.toLowerCase() !== 'mark') {
			unmarkOpt = `element :  '${name}',\n  `;
		}
		const klass = tab.getElement('className', 'input').val().trim();
		if (klass) {
			unmarkOpt += `className :  '${klass}',\n  `;
		}

		unmarkOpt += (tab.isChecked('iframes') ? 'iframes : true,\n  ' : '') + (tab.isChecked('shadowDOM') ? 'shadowDOM : true,\n  ' : '');

		if (kind === 'jq') {
			code = `$('selector')` + (unmark ? `.unmark({\n  ${unmarkOpt}done : () => {\n    $('selector')` : '');

		} else if (kind === 'js') {
			code = `const instance = new Mark(document.querySelector('selector'));\ninstance` + (unmark ? `.unmark({\n  ${unmarkOpt}done : () => {\n    instance` : '');

		} else {
			const time = `\n    time = performance.now();`;
			code = `let options;\n`;

			if (currentLibrary.jquery) {
				code += `const instance = $(tab.getTestElement());\ninstance.unmark({\n  ${unmarkOpt}done : () => {${time}\n    instance`;

			} else {
				code += `const instance = new Mark(tab.getTestElement());\ninstance.unmark({\n  ${unmarkOpt}done : () => {${time}\n    instance`;
			}
		}

		if (text = info.editor.toString().trim()) {
			switch (currentType) {
				case 'string_' :
					str = `.mark(${util.stringify(text)}, ${optionCode});`;
					break;

				case 'array' :
					str = `.mark(${text}, ${optionCode});`;
					break;

				case 'regexp' :
					str = `.markRegExp(${text}, ${optionCode});`;
					break;

				case 'ranges' :
					str = `.markRanges(${text}, ${optionCode});`;
					break;

				default : break;
			}

		} else {
			$('.generated-code code').text('');
			log(`Missing search parameter\n`, true);
			$(tab.getSearchEditorInfo().selector).addClass('error');
			return '';
		}

		code += str + (unmark ? '\n  }\n});' : '');
		code = this.buildCustomCode(code, kind);

		if (kind !== 'internal') {
			code = (kind === 'jq' ? '//jQuery\n' : kind === 'js' ? '//javascript\n' : '') + code;

		} else {
			// returning an object 'options' is only necessary for testing purposes
			code += '\n\nreturn options;'
		}

		return code;
	},

	buildCustomCode : function(code, kind) {
		let text;
		const reg = /\s+/g,
			editor = types[currentType].customCodeEditor;

		if (editor && (text = editor.toString()) && /<<markjsCode>>/.test(text)) {
			if (kind === 'internal') {
				// necessary for the next/previous buttons functionality
				const fn = `highlighter.flagStartElement(element, info)`,
					eachParam = this.getEachParameters(),
					doneParam = this.getDoneParameters();

				text = addCode(text, fn, eachParam, /\bfunction\s+each(\([^)]+\))\s*\{/);
				text = addCode(text, `highlighter.finish${doneParam}`, doneParam, /\bfunction\s+done(\([^)]+\))\s*\{/);
			}
			text = text.replace(new RegExp(`${this.comment}\s*\n`), '');

			// string replace() function causes problem when the code contains combination of $$, $&, $', $`, $n
			code = text.split(/<<markjsCode>>(?:[ \t]*\/\/.*)?/).join(code);
		}

		function addCode(text, fn, param, regex) {
			// adds code if normalized parameters are equal
			return text.replace(regex, (m, gr1) => gr1.replace(reg, '') === param.replace(reg, '') ? `${m}\n  ${fn};\n` : m);
		}

		return code;
	},

	buildOptions : function(kind, unmark) {
		const obj = types[currentType],
			across = tab.isChecked('acrossElements'),
			indent = ' '.repeat(unmark ? 6 : 2),
			end = unmark ? ' '.repeat(4) : '';

		if ( !obj) return '{}';

		let value, text, code = '';

		obj.options.every(option => {
			const selector = `${optionPad} .${option}`,
				input = selector + ' input',
				opt = defaultOptions[option];

			if (opt) {
				switch (opt.type) {
					case 'checkbox' :
						value = $(input).prop('checked');
						if (isNullOrUndefined(value)) break;

						if (option === 'separateWordSearch' && value === opt.value) {
							const selectValue = tab.getElement('separateWordValue', 'select').val();

							if (selectValue && selectValue != 'true') {
								code += `${indent}${option} : '${selectValue}',\n`;
								break;
							}
						}

						if (option === 'acrossElements' && value === true && isVisible('acrossElementsValue')) {
							const selectValue = tab.getElement('acrossElementsValue', 'select').val();

							if (selectValue && selectValue != 'true') {
								code += `${indent}${option} : '${selectValue}',\n`;
								break;
							}
						}

						if (value !== opt.value) {
							if (option === 'combinePatterns') {
								if (markArray()) {
									value = tab.getNumericalValue('combineNumber', 10);

								} else {
									value = null;
								}

							} else if (option === 'shadowDOM') {
								const editor = tab.getOptionEditor('shadowStyle');
								value = editor && (text = editor.toString().trim()) ? text : value;

							} else if (option === 'wrapAllRanges') {
								if ( !(currentType === 'regexp' && tab.isChecked('separateGroups') || currentType === 'ranges')) {
									value = null;
								}

							} else if (option === 'cacheTextNodes') {
								if ( !markArray()) value = null;

							} else if (option === 'blockElementsBoundary') {
								if (across) {
									const editor = tab.getOptionEditor('blockElements');
									value = editor && (text = editor.toString().trim()) ? text : value;

								} else {
									value = null;
								}
							}

							if (value !== null) {
								code += `${indent}${option} : ${value},\n`;
							}
						}
						break;

					case 'text' :
						text = $(input).val().trim();

						if (text && text !== opt.value) {
							code += `${indent}${option} : '${text}',\n`;
						}
						break;

					case 'editor' :
						if (option !== 'accuracyObject') {
							const editor = tab.getOptionEditor(option);

							if (editor && (text = editor.toString().trim())) {
								code += `${indent}${option} : ${text},\n`;
							}
						}
						break;

					case 'select' :
						value = $(selector + ' select').val();
						if (isNullOrUndefined(value)) break;

						if (value !== opt.value) {
							code += `${indent}${option} : `;

							if (option === 'accuracy' && isAccuracyValue(value)) {
								const editor = tab.getOptionEditor('accuracyObject');
								code += editor && (text = editor.toString().trim()) ? `${text},\n` : `'${value}',\n`;

							} else {
								code += `'${value}',\n`;
							}
						}
						break;

					case 'number' :
						if (option === 'iframesTimeout' && !tab.isChecked('iframes')
							|| option === 'ignoreGroups' && tab.isChecked('separateGroups')) break;

						value = parseInt($(input).val().trim()) || opt.value;

						if (value !== opt.value) {
							code += `${indent}${option} : ${value},\n`;
						}
						break;

					default : break;
				}
			}
			return true;
		});

		code += this.buildCallbacks(kind, unmark);
		code = !code.trim() ? '{}' : (kind === 'internal' ? 'options = ' : '') + `{\n${code}}`;

		return code;
	},

	buildCallbacks : function(kind, unmark) {
		let text,
			code = '',
			indent = ' '.repeat(unmark ? 6 : 2),
			end = unmark ? ' '.repeat(4) : '';

		const editor = types[currentType].customCodeEditor;

		if (editor && (text = editor.toString())) {
			if (/\bfunction\s+filter\s*\(/.test(text)) {
				code += `${indent}filter : filter,\n`;
			}

			if (/\bfunction\s+each\s*\(/.test(text)) {
				code += `${indent}each : each,\n`;
			}

			if (/\bfunction\s+done\s*\(/.test(text)) {
				code += `${indent}done : done,\n`;
			}

			if (kind === 'internal') {
				code += `${indent}noMatch : (t) => { noMatchTerms.push(t); }\n`;
			}

		} else {
			if (kind === 'internal') {
				code = `${code}${indent}done : highlighter.finish\n`;

			} else if ($('#callbacks').prop('checked')) {
				code = `${indent}filter : ${this.getFilterParameters()} => {},\n`;
				code += `${indent}each : ${this.getEachParameters()} => {},\n`;
				code = `${code}${indent}done : ${this.getDoneParameters()} => {}\n`;
			}
		}

		return code + end;
	},

	getFilterParameters : function() {
		if (currentType === 'string_' || currentType === 'array') {
			return `(textNode, term, matchesSoFar, termMatchesSoFar, info)`;

		} else if (currentType === 'regexp') {
			return `(textNode, matchString, matchesSoFar, info)`;
		}
		return `(textNode, range, matchString, index)`;
	},

	getEachParameters : function() {
		if (currentType === 'ranges') {
			return `(element, range, info)`;
		}
		return `(element, info)`;
	},

	getDoneParameters : function() {
		const stats = currentType === 'string_' || currentType === 'array';
		return `(totalMarks, totalMatches${stats ? ', termStats' : ''})`;
	},

	initCodeSnippet : function() {
		this.snippet = (this.comment + this.defaultSnippet).replace(/\bfilter\(\)/g, 'filter' + codeBuilder.getFilterParameters())
			.replace(/\beach\(\)/g, 'each' + codeBuilder.getEachParameters())
			.replace(/\bdone\(\)/g, 'done' + codeBuilder.getDoneParameters());
	}
};

const Json = {
	buildJson : function(format) {
		const obj = types[currentType];

		let textMode = false;

		if (obj.testEditorMode === 'text') {
			tab.setHtmlMode(null, false);
			textMode = true;
		}

		let json = this.serialiseOptions(`{"version":"${version}","library":"advanced","section":{`),
			text;

		json += this.serialiseCustomCode();

		const editor = tab.getOptionEditor(obj.queryEditor);
		if (editor && (text = editor.toString()).trim()) {
			json += `,"${obj.queryEditor}":${JSON.stringify(text)}`;
		}

		const selectorsInfo = tab.getSelectorsEditorInfo();
		if (selectorsInfo.editor && (text = selectorsInfo.editor.toString()).trim()) {
			json += `,"selectors":${JSON.stringify(text)}`;
			json += `,"selectorAll":${$(selectorsInfo.all).prop('checked')}`;
		}

		const testEditor = tab.getTestEditor();
		if ((text = testEditor.toString()).trim()) {
			const mode = types[currentType].testEditorMode;

			if (mode === 'html') {
				text = util.removeMarks(text);
			}
			json += `,"testString":{"mode":"${mode}","content":${JSON.stringify(text)}}`;
		}
		json += '}}';

		const jsonObj = Json.parseJson(json);
		if ( !jsonObj) return null;

		if (format) {
			json = JSON.stringify(jsonObj, null, '    ');
		}

		if (textMode) {
			tab.setTextMode(null);
		}

		return json;
	},

	serialiseOptions : function(json) {
		const obj = types[currentType],
			across = tab.isChecked('acrossElements');

		let value, text;
		json += `"type":"${currentType}"`;

		obj.options.every(option => {
			const selector = `${optionPad} .${option}`,
				input = selector + ' input',
				opt = defaultOptions[option];

			if (opt) {
				switch (opt.type) {
					case 'checkbox' :
						value = $(input).prop('checked');
						if (isNullOrUndefined(value)) break;

						if (option === 'separateWordSearch' && value === opt.value) {
							const selectValue = tab.getElement('separateWordValue', 'select').val();

							if (selectValue && selectValue != 'true') {
								json += `,"${option}":"${selectValue}"`;
								break;
							}
						}

						if (option === 'acrossElements' && value === true && isVisible('acrossElementsValue')) {
							const selectValue = tab.getElement('acrossElementsValue', 'select').val();

							if (selectValue && selectValue != 'true') {
								json += `,"${option}":"${selectValue}"`;
								break;
							}
						}

						if (value !== opt.value) {
							if (option === 'combinePatterns') {
								if (markArray()) {
									json += `,"combinePatterns":${tab.getNumericalValue('combineNumber', 10)}`;
								}

							} else if (option === 'shadowDOM') {
								const editor = tab.getOptionEditor('shadowStyle');

								if (editor && (text = editor.toString().trim())) {
									json += `,"${option}":${JSON.stringify(text)}`;

								} else {
									json += `,"${option}":${value}`;
								}

							} else if (option === 'wrapAllRanges') {
								if (currentType === 'regexp' && tab.isChecked('separateGroups') || currentType === 'ranges') {
									json += `,"${option}":${value}`;
								}

							} else if (option === 'cacheTextNodes') {
								if (markArray()) {
									json += `,"${option}":${value}`;
								}

							} else if (option === 'blockElementsBoundary') {
								if (across) {
									const editor = tab.getOptionEditor('blockElements');

									if (editor && (text = editor.toString().trim())) {
										json += `,"${option}":${JSON.stringify(text)}`;

									} else {
										json += `,"${option}":${value}`;
									}
								}

							} else {
								json += `,"${option}":${value}`;
							}
						}
						break;

					case 'text' :
						text = $(input).val().trim();

						if (text && text !== opt.value) {
							json += `,"${option}":"${text}"`
						}
						break;

					case 'editor' :
						if (option !== 'accuracyObject') {
							const editor = tab.getOptionEditor(option);

							if (editor && (text = editor.toString().trim())) {
								json += `,"${option}":${JSON.stringify(text)}`;
							}
						}
						break;

					case 'select' :
						value = $(selector + ' select').val();
						if (isNullOrUndefined(value)) break;

						if (value !== opt.value) {
							if (option === 'accuracy' && isAccuracyValue(value)) {
								const editor = tab.getOptionEditor('accuracyObject');
								json += editor && (text = editor.toString().trim()) ? `,"${option}":${JSON.stringify(text)}` : `,"${option}":"${value}"`;

							} else {
								json += `,"${option}":"${value}"`;
							}
						}
						break;

					case 'number' :
						if (option === 'iframesTimeout' && !tab.isChecked('iframes')
							|| option === 'ignoreGroups' && tab.isChecked('separateGroups')) break;

						value = parseInt($(input).val().trim()) || opt.value;

						if (value !== opt.value) {
							json += `,"${option}":${value}`;
						}
						break;

					default : break;
				}
			}
			return true;
		});

		return json;
	},

	serialiseCustomCode : function() {
		let code;
		const editor = types[currentType].customCodeEditor;

		if (editor && (code = editor.toString().trim())) {
			return `,"customCode":${JSON.stringify(code)}`;
		}
		return '';
	},

	parseJson : function(str) {
		let json;
		try { json = JSON.parse(str); } catch (e) {
			log('\nFailed to parse this json\n' + e.message, e.stack);
		}
		return json;
	}
};

function registerEvents() {

	$(window).on("beforeunload", function(e) {
		if (settings.showWarning && isDirty()) {
			e.preventDefault();
			e.returnValue = '';
			return '';
		}
	});

	$('main').on('click', function(e) {
		$('.setting-form, .file-form').each((i, form) => {
			if ($(form).css('display') === 'block' && !form.contains(e.target)) {
				$(form).css('display', 'none');
			}
		});
	});

	$(document).on('mouseup', function() {
		$('section .editor, header li').removeClass('error warning');
	});

	$(".mark-type li").on('click', function() {
		tab.selectTab($(this).data('type'));
		tab.initTab();
	});

	$(".generated-code details").on('toggle', function(e) {
		const attr = $(this).attr('open');
		settings.saveValue('generated_code', attr ? 'opened' : 'closed');

		if (attr && !$(this).find('pre').text()) {
			runCode();
		}
	});

	$("#internal-code").on('toggle', function(e) {
		const attr = $(this).attr('open');
		settings.saveValue('internal_code', attr ? 'opened' : 'closed');
	});

	$(".customCode details, .customCode details>summary").on('toggle', function(e) {
		const button = $(this).parents('.customCode').first().find('button.clear');

		if ($(this).attr('open')) {
			const editor = types[currentType].customCodeEditor;

			if ( !editor || !editor.toString().trim()) {
				tab.updateCustomCode(codeBuilder.snippet);
			}
			button.removeClass('hide');
			tab.clear();
			codeBuilder.build('js-jq');

		} else {
			button.addClass('hide');
		}
	});

	$("input[type=text]").on('input', function(e) {
		codeBuilder.build('js-jq');
		if (settings.runOnchange) {
			runCode();
		}
		tab.setDirty(true);
	});

	$("input[type=checkbox], input[type=number], input[type=text], select[name]").on('change', function(e) {
		codeBuilder.build('js-jq');

		if ($(this).attr('name')) {
			if (settings.runOnchange) {
				runCode();
			}
			tab.setDirty(true);
		}
	});

	$("label[name], input[name], option[name], details[name], div.editor[name], select[name]").on('mouseenter', function(e) {
		if (settings.showTooltips || e.ctrlKey || e.metaKey) {
			showTooltip($(this).attr('name'), $(this), e);
		}
	});

	$('button.open-json-form').on('click', function() {
		if ($('.json-form:visible').length) {
			$('.json-form').css('display', 'none');

		} else {
			$('.json-form').css('display', 'block');

			if (jsonEditor === null) {
				jsonEditor = CodeJar($('.json-form .editor')[0], () => {});

				jsonEditor.onUpdate(code => {
					$('button.import-json').attr('disabled', code.trim() ? false : true);
				});
			}

			$('button.import-json').attr('disabled', jsonEditor.toString().trim() ? false : true);
		}
	});

	$('.json-form>.close, .setting-form>.close').on('click', function() {
		$(this).parent().css('display', 'none');
	});

	$('button.open-setting-form').on('click', function() {
		if ($('.setting-form:visible').length) {
			$('.setting-form').css('display', 'none');

		} else {
			$('.setting-form').css('display', 'block');
		}
	});

	$('button.open-file-form').on('click', function() {
		if ($('.file-form:visible').length) {
			$('.file-form').css('display', 'none');

		} else {
			$('.file-form').css('display', 'block');
			$('.file-form .file-name').attr('placeholder', getFileName());
		}
	});

	$('.file-form>.close').on('click', function() {
		$(this).parent().css('display', 'none');
	});

	$(document).on('keydown', function(e) {
		if (e.ctrlKey || e.metaKey) {
			if (e.code === 'KeyS') {    // s
				$('.file-form a.save-file')[0].click();
				e.preventDefault();

			} else if (e.code === 'KeyO') {    // o
				$('.file-form #file-dialog')[0].click();
				e.preventDefault();
			}
		}
	});

	$('.file-form a.save-file').on('click', function(e) {
		const json = Json.buildJson(true);

		if (json) {
			let name = $('.file-form .file-name').val();

			if (name && !/\.json$/i.test(name)) {
				name = name.replace(/[.]+$/g, '') + '.json';
			}
			name = (name || getFileName());

			this.download = name;
			this.href = URL.createObjectURL(new Blob([json], { type : 'text/json' }));
			//URL.revokeObjectURL(this.href);

			$('.file-form .file-name').val(name);
			settings.saveValue(currentType + '-fileName', name);
		}
	});

	$('.file-form #file-dialog').on('change', function() {
		const reader = new FileReader(),
			file = this.files[0];
		reader.file = file;

		reader.onload = function() {
			importer.loadJson(this.result);

			$('.file-form .loaded-file-name').text(file.name);
			$('.file-form .file-name').val(file.name);
			$('.file-form').css('display', 'none');
		};

		reader.readAsText(file);
	});

	$(".copy").on('mouseup', function(e) {
		document.getSelection().selectAllChildren($(this).parent().parent().find('.editor')[0]);
		document.execCommand('copy');
		document.getSelection().removeAllRanges();
	});

}

const util = {
	voidElements : ['meta', 'link', 'br', 'col', 'hr', 'input', 'img', 'area', 'menuitem', 'wbr', 'param', 'source', 'track', 'base', 'basefont', 'embed', 'frame', 'isindex', 'keygen', 'nextid', 'nobr', 'plaintext'],

	isVoidElement : function(node) {
		return this.voidElements.indexOf(node.nodeName.toLowerCase()) !== -1;
	},

	entitize : function(text) {
		text = text.replace(/[<>&"']/g, m => {
			return m === '<' ? '&lt;' : m === '>' ? '&gt;' : m === '&' ? '&amp;' : m === '"' ? '&quot;' : '&#039;';
		});
		return text;
	},

	// stringifies a str if it isn't a real string
	stringify : function(str) {
		const reg = /^(?:(['"])(?:(?:(?!\1|\\).)|(?:\\.))+\1|`(?:(?:(?![`\\])[^])|(?:\\.))+`)$/;

		return reg.test(str.trim()) ? str : JSON.stringify(str);
	},

	distinct : function(arr) {
		const array = [];

		for (let i = 0; i < arr.length; ++i) {
			if (array.indexOf(arr[i]) === -1) array.push(arr[i]);
		}
		return array;
	},

	removeMarks : function(text) {
		// removes all mark elements from the text
		const regex = new RegExp(`<${markElement} data-markjs=[^>]+>((?:(?!</${markElement}>)[^])+)</${markElement}>`, 'g');
		let max = 20;    // just to be on the safe side

		while (--max > 0 && regex.test(text)) {
			text = text.replace(regex, '$1');
		}
		return text;
	}
};

const settings = {
	loadDefault : true,
	showTooltips : false,
	showWarning : true,
	runOnchange : false,

	save : function() {
		const str = JSON.stringify(settings);
		this.saveValue('settings', str);
	},

	load : function() {
		const str = this.loadValue('settings');
		if (str) {
			const json = Json.parseJson(str);
			if (json) {
				if ( !isNullOrUndefined(json.loadDefault)) {
					this.loadDefault = json.loadDefault;
				}

				if ( !isNullOrUndefined(json.showTooltips)) {
					this.showTooltips = json.showTooltips;
				}

				if ( !isNullOrUndefined(json.showWarning)) {
					this.showWarning = json.showWarning;
				}

				if ( !isNullOrUndefined(json.runOnchange)) {
					this.runOnchange = json.runOnchange;
				}
				this.setCheckboxes();
			}
		}
	},

	setCheckboxes : function() {
		$('#load-default').prop('checked', this.loadDefault);
		$('#show-tooltips').prop('checked', this.showTooltips);
		$('#unsaved').prop('checked', this.showWarning);
		$('#run-onchange').prop('checked', this.runOnchange);
	},

	changed : function(elem) {
		this.loadDefault = $('#load-default').prop('checked');
		this.showTooltips = $('#show-tooltips').prop('checked');
		this.showWarning = $('#unsaved').prop('checked');
		this.runOnchange = $('#run-onchange').prop('checked');
		this.save();
	},

	loadValue : function(key) {
		try {
			return localStorage.getItem(key);
		} catch (e) {
			log('localStorage ' + e.message, true);
		}
		return null;
	},

	saveValue : function(key, value) {
		try {
			const saved = localStorage.getItem(key);
			if (value !== saved) {
				localStorage.setItem(key, value);
			}
		} catch (e) {
			log('localStorage ' + e.message, true);
		}
	}
};

function toText(obj, title, msg) {
	let text = '';
	for (let key in obj) {
		text += `\n${key} = ${obj[key]}`;
	}
	return text ? title + text : msg ? title + msg : '';
}

function getFileName() {
	let name = settings.loadValue(currentType + '-fileName');

	return name || `${(currentType === 'string_' ? 'string' : currentType)}.json`;
}

function showTooltip(id, elem, e) {
	showHideInfo(id);

	elem.data('powertiptarget', id).powerTip({
		intentPollInterval : 300,
		fadeInTime : 100,
		smartPlacement : true,
		mouseOnToPopup : true,
		placement : 'w',
		offset : 30,
	}).on({
		powerTipClose : function() {
			elem.powerTip('destroy');
		}
	});
	elem.powerTip('show', e);
}

function showHideInfo(id) {
	const separateGroups = tab.isChecked('separateGroups'),
		acrossElements = tab.isChecked('acrossElements'),
		info = $('article.options-info #' + id),
		elemsAE = info.find('.acrossElements').addClass('hide'),
		elemsSG = info.find('.separateGroups').addClass('hide');

	if (acrossElements) {
		elemsAE.each((i, elem) => {
			if ($(elem).hasClass('separateGroups')) {
				if (separateGroups) $(this).removeClass('hide');

			} else $(elem).removeClass('hide');
		});
	}

	if (separateGroups) {
		elemsSG.each((i, elem) => {
			if ($(elem).hasClass('acrossElements')) {
				if (acrossElements) $(elem).removeClass('hide');

			} else $(elem).removeClass('hide');
		});
	}
}

function log(message, error, warning) {
	if (error) {
		$('header .mark-type li.selected').addClass('error');
		message = `<span style="color:red">${message}</span><br>`;
		$('.results code').html(message);
		return;

	} else if (warning) {
		message = `<span style="color:#ca5500">${message}</span><br>`;
	}
	let html = $('.results code').html();
	$('.results code').html((html ? html + '\n' : '') + message);
}

function isVisible(klass) {
	const elem = $(`${optionPad} .${klass}`);
	return !elem.hasClass('hide') && !elem.hasClass('disable');
}

function isNullOrUndefined(prop) {
	return typeof prop === 'undefined' || prop === null;
}

function isDirty() {
	for (const type in types) {
		if (types[type].isDirty) return true;
	}
	return false;
}

function testContainerScrolled() {
	isScrolled = true;
}

// DOM 'onclick' event
function previousMatch() {
	if (canBeNested) {
		if (--currentIndex <= 0) currentIndex = 0;

		highlightMatch2(true);

	} else {
		if ( !startElements.length) return;

		findNextPrevious(false);
	}
}

// DOM 'onclick' event
function nextMatch() {
	if (canBeNested) {
		if (++currentIndex > matchCount - 1) currentIndex = matchCount - 1;

		highlightMatch2(true);

	} else {
		if ( !startElements.length) return;

		findNextPrevious(true);
	}
}

function findNextPrevious(next) {
	let elem,
		top = $(`${currentSection} .testString>.test-container`).offset().top;

	if (next) {
		startElements.each((i, el) => {
			if (isScrolled) {
				if ($(el).offset().top > top) elem = $(el);

			} else if (i > currentIndex) elem = $(el);

			if (elem) {
				currentIndex = i;
				return false;
			}
		});
		if ( !elem) {
			elem = startElements.last();
			currentIndex = startElements.length - 1;
		}

	} else {
		startElements.each((i, el) => {
			if (isScrolled) {
				if ($(el).offset().top > top) {
					currentIndex = i > 0 ? i - 1 : i;
					return false;
				}

			} else if (i === currentIndex) {
				currentIndex = i > 0 ? i - 1 : i;
				return false;
			}
			elem = $(el);
		});
		if ( !elem) {
			elem = startElements.first();
			currentIndex = 0;
		}
	}

	highlightMatch(elem, true);
}

function highlightMatch(elem, buttonClick) {
	marks.removeClass('current');

	const htmlMode = types[currentType].testEditorMode === 'html';
	let found = false;

	marks.each((i, el) => {
		if ( !found) {
			if (el === elem[0]) found = true;

		} else {
			// the start of the next 'start element' means the end of the current match
			if ($(el).data('markjs') === 'start-1') return false;
		}

		if (found) {
			if (htmlMode) {
				$(el).find(markElementSelector + '.mark-term').addClass('current');

			} else {
				$(el).addClass('current');
				$(el).find(markElementSelector).addClass('current');
			}
		}
	});

	setButtonOpacity();
	if (buttonClick || scroll()) {
		setTimeout(scrollIntoView(elem), 100);
	}
}

// highlight a whole match using only the 'start elements' is not possible with nesting/overlapping matches
// using numbers as unique match identifiers can solve this problem, but only with single-pass methods - 'markRegExp' and 'markRanges'
function highlightMatch2(buttonClick) {
	marks.removeClass('current');
	let elems;

	if (types[currentType].testEditorMode === 'html') {
		elems = marks.filter((i, elem) => $(elem).data('markjs') === currentIndex);
		elems.filter((i, elem) => $(elem).hasClass('mark-term')).addClass('current');
		elems.find('mark[data-markjs].mark-term').addClass('current');

	} else {
		elems = marks.filter((i, elem) => $(elem).data('markjs') === currentIndex).addClass('current');
		elems.find(`${markElement}[data-markjs]`).addClass('current');
	}
	setButtonOpacity();
	if (buttonClick || scroll()) {
		setTimeout(scrollIntoView(elems.first()), 100);
	}
}

function setButtonOpacity() {
	if (canBeNested && matchCount === 0 || !canBeNested && !startElements.length) {
		previousButton.css('opacity', 0.5);
		nextButton.css('opacity', 0.5);

	} else {
		previousButton.css('opacity', currentIndex > 0 ? 1 : 0.5);
		nextButton.css('opacity', currentIndex < (canBeNested ? matchCount - 1 : startElements.length - 1) ? 1 : 0.5);
	}
}

function scroll() {
	return $(window).width() > 980;    // not collapsed to the single column
}

function scrollIntoView(elem) {
	if (elem.length) {
		elem[0].scrollIntoView(true);
		// 'scrollBy' is very slow in Firefox on big test content
		window.scrollBy(0, -1000);
		setTimeout(function() { isScrolled = false; }, 150);
	}
}

function detectLibrary() {
	let jq = true;

	try { $().mark('a'); } catch (e) { jq = false; }

	currentLibrary.jquery = jq;
}

function getContext(selector, jquery) {
	return jquery ? $(selector) : new Mark(document.querySelector(selector));
}























