
const test = {
	jsons : {
		string_ : [
			`{"section":{"type":"string_","element":"span","className":"test","exclude":"['h1','.ignore']","accuracy":"{value:'exactly',limiters:[',','.']}","diacritics":false,"synonyms":"{'one':'1'}","iframes":true,"iframesTimeout":4999,"acrossElements":true,"caseSensitive":true,"ignoreJoiners":true,"ignorePunctuation":"[',','.']","wildcards":"enabled","blockElementsBoundary":"{tagNames:['div','p'],char:'.'}","combinePatterns":101,"cacheTextNodes":true,"shadowDOM":"{style:'mark[data-markjs]{color:red;}'}","debug":true,"queryString":"query test","selectors":"p,li","selectorAll":true}}`,

			`{"section":{"type":"string_","cacheTextNodes":true,"queryString":"query test"}}`,

			`{"section":{"type":"string_","combinePatterns":1,"shadowDOM":true,"queryString":"query test"}}`,

			`{"section":{"type":"string_","acrossElements":true,"blockElementsBoundary":true,"queryString":"query test"}}`,
		],
		array : [
			`{"section":{"type":"array","element":"span","className":"test","exclude":"['h1','.ignore']","accuracy":"{value:'exactly',limiters:[',','.']}","diacritics":false,"synonyms":"{'one':'1'}","iframes":true,"iframesTimeout":4999,"acrossElements":true,"caseSensitive":true,"ignoreJoiners":true,"ignorePunctuation":"[',','.']","wildcards":"enabled","blockElementsBoundary":"{tagNames:['div','p'],char:'.'}","combinePatterns":101,"cacheTextNodes":true,"shadowDOM":"{style:'mark[data-markjs]{color:red;}'}","debug":true,"queryArray":"['query','test']","selectors":"p,li","selectorAll":true}}`,
			`{"section":{"type":"array","acrossElements":true,"blockElementsBoundary":true,"combinePatterns":10,"cacheTextNodes":true,"shadowDOM":true,"debug":true,"queryArray":"['query','test']","selectors":"p,li","selectorAll":true}}`,
		],
		regexp : [
			`{"section":{"type":"regexp","element":"span","className":"test","exclude":"['h1','.ignore']","iframes":true,"iframesTimeout":4999,"acrossElements":true,"separateGroups":true,"blockElementsBoundary":"{tagNames:['div','p'],char:'.'}","wrapAllRanges":true,"shadowDOM":"{style:'mark[data-markjs]{color:red;}'}","debug":true,"queryRegExp":"/\\\\b(?:query|test)\\\\b/dgi","selectors":"p,li","selectorAll":true}}`,
			`{"section":{"type":"regexp","element":"span","className":"test","exclude":"['h1','.ignore']","iframes":true,"iframesTimeout":4999,"ignoreGroups":1,"debug":true,"queryRegExp":"/()\\\\b(query|test)\\\\b/dgi","selectors":"p,li","selectorAll":true}}`,

			`{"section":{"type":"regexp","acrossElements":true,"separateGroups":true,"wrapAllRanges":true,"queryRegExp":"/\\\\b(query|test)\\\\b/dgi"}}`
		],
		ranges : [
			`{"section":{"type":"ranges","element":"span","className":"test","exclude":"['h1','.ignore']","iframes":true,"iframesTimeout":4999,"wrapAllRanges":true,"shadowDOM":"{style:'mark[data-markjs]{color:red;}'}","debug":true,"queryRanges":"[{'start':0,'length':5},{'start':6,'length':6}]","selectors":"p,li","selectorAll":true}}`,

			`{"section":{"type":"ranges","iframes":true,"wrapAllRanges":true,"shadowDOM":true,"queryRanges":"[{'start':0,'length':5},{'start':6,'length':6}]"}}`,

			`{"section":{"type":"ranges","queryRanges":"[{'start':0,'length':5},{'start':6,'length':6}]","selectors":"p","selectorAll":false}}`,

			`{"section":{"type":"ranges","markLines":true,"wrapAllRanges":true,"queryRanges":"[{'start':1,'length':1},{'start':2,'length':1}]"}}`,
		]
	},

	// for testing options, which are dependable on other option(s)
	dependables : {
		string_ : [
			{ json : `{"section":{"type":"string_","separateWordSearch":false,"combinePatterns":100,"cacheTextNodes":true,"blockElementsBoundary":true,"queryString":"query test"}}`, options : ['combinePatterns', 'cacheTextNodes', 'blockElementsBoundary'] },

			{ json : `{"section":{"type":"string_","separateWordSearch":false,"acrossElements":true,"cacheTextNodes":true,"queryString":"query test"}}`, options : ['cacheTextNodes'] },
		],

		array : [
			{ json : `{"section":{"type":"array","diacritics":false,"wrapAllRanges":true,"blockElementsBoundary":true,"queryArray":"['query','test']"}}`, options : ['wrapAllRanges', 'blockElementsBoundary'] },

			{ json : `{"section":{"type":"array","diacritics":false,"acrossElements":true,"wrapAllRanges":true,"queryArray":"['query','test']"}}`, options : ['wrapAllRanges'] },
		],

		regexp : [
			{ json : `{"section":{"type":"regexp","wrapAllRanges":true,"blockElementsBoundary":true,"queryRegExp":"/\\\\b(query|test)\\\\b/gi"}}`, options : ['wrapAllRanges', 'blockElementsBoundary'] },

			{ json : `{"section":{"type":"regexp","acrossElements":true,"wrapAllRanges":true,"queryRegExp":"/\\\\b(query|test)\\\\b/gi"}}`, options : ['wrapAllRanges'] },
		],
	},

	run : function() {
		console.clear();
		test.importExportTest();
		test.optionsTest(true);
		test.optionsTest(false);
		test.dependableOptionsTest(false);
		test.dependableOptionsTest(true);
		test.codeBuilderTest();
		test.codeBuilderDependableTest();
	},

	// tests importer/serializer
	importExportTest : function() {
		let obj, json, section, success = true;

		for (const type in types) {
			tab.selectTab(type);
			tab.initializeEditors();
			this.clearCustomEditor(type);

			this.jsons[type].forEach(str => {
				obj = Json.parseJson(str);
				this.addTestString(obj);

				importer.setOptions(obj);

				if ( !((json = Json.buildJson()) && (section = Json.parseJson(json).section) && this.isEquals(obj.section, section))) {
					success = false;
				}
			});
			this.logResults(`The 'import/export' test for ${type} is ${this.result(success)}`, success);
		}
	},

	// tests correctness of setting/resetting mark.js options
	optionsTest : function(internal) {
		let obj;

		for (const type in types) {
			this.initialize(type, internal);

			this.checkDefaultValues(internal);
			//continue;

			this.jsons[type].forEach(json => {
				if (obj = Json.parseJson(json)) {
					this.addTestString(obj);
					importer.setOptions(obj);
					tab.updateCustomCode(codeBuilder.snippet);

					const options = internal ? runCode() : highlighter.getCurrentSettings();
					this.checkSetOptions(options, obj, internal);
				}
			});
		}
	},

	// tests whether all options are set to default value
	checkDefaultValues : function(internal) {
		const options = internal ? runCode() : highlighter.getCurrentSettings();
		if ( !options) {
			console.error(`Failed to get current options for ${currentType}`);
			return;
		}

		let success = true;

		if (internal) {
			const callbacks = ['filter', 'each', 'done', 'noMatch'];

			for (const name in defaultOptions) {
				let value = options[name];

				// the internal code shouldn't have any option except callbacks
				if ( !isNullOrUndefined(value)) {
					console.log(`The option "${name} : ${value}" is not reset to default value ${defaultOptions[name].value}. ${currentType}, internal test`);
					success = false;
				}
			}

			callbacks.forEach(name => {
				if (isNullOrUndefined(options[name])) {
					console.log(`The callback '${name}' is missing in the internal code. ${currentType}`);
					success = false;
				}
			});

		} else {
			let value, defaultValue;

			for (const name in defaultOptions) {
				defaultValue = defaultOptions[name].value;
				value = options[name];

				if ( !isNullOrUndefined(value) && value !== defaultValue) {
					if (typeof defaultValue === 'object' && typeof value === 'object' && this.isEquals(defaultValue, value)) continue;

					console.log(`The option "${name} : ${value}" is not reset to default value ${defaultValue}. ${currentType}`);
					success = false;
				}
			}
		}
		this.logResults(`The 'set options to default value' test for ${currentType} is ${this.result(success)}${internal ? ', internal test' : ''}`, success);
	},

	checkSetOptions : function(options, obj, internal) {
		if ( !options) {
			console.error(`Failed to get current options for ${currentType}, ${internal ? 'internal test' : ''}`);
			return;
		}
		// contains properties which are not mark.js options
		let array = ['type', 'queryString', 'queryArray', 'queryRegExp', 'queryRanges', 'testString', 'selectors', 'selectorAll'];
		let value, setValue, success = true;

		for (const name in obj.section) {
			if (array.includes(name)) continue;

			value = obj.section[name];
			setValue = options[name];

			if (isNullOrUndefined(setValue)) {
				console.log(`The option ${name} value is ${value}. ${currentType}, ${internal ? 'internal test' : ''}`);
				success = false;
				continue;
			}

			if (typeof setValue === 'object') {
				try {
					value = new Function('"use strict"; return (' + value + ')')();

				} catch (e) {
					console.log(e.message, e.stack);
				}

				if (value) {
					if (this.isEquals(value, setValue)) continue;

					console.log(`The option '${name}' values are not equals ${value} != ${setValue}. ${currentType}, ${internal ? 'internal test' : ''}`);
					success = false;

				} else {
					console.log(`${currentType} failed to evaluate '${name}' ${value}`);
					success = false;
				}

			} else if (value !== setValue) {
				console.log(`The option '${name}' values are not equals ${value} != ${setValue}. ${currentType}, ${internal ? 'internal test' : ''}`);
				success = false;
			}
		}

		this.logResults(`The 'set options' test for ${currentType} is ${this.result(success)}`, success);
	},

	// enable new options, which are dependable on other option(s), can cause some penalty
	// mark.js internally doesn't checks option dependencies
	dependableOptionsTest : function(internal) {
		let obj, array;

		for (const type in types) {
			this.initialize(type, internal);

			if ( !(array = this.dependables[type])) continue;

			array.forEach(o => {
				if (obj = Json.parseJson(o.json)) {
					this.addTestString(obj);
					importer.setOptions(obj);
					tab.updateCustomCode(codeBuilder.snippet);

					const options = internal ? runCode() : highlighter.getCurrentSettings();
					this.checkDependableOptions(obj, o.options, internal);
				}
			});
		}
	},

	checkDependableOptions : function(options, obj, dependableOpts, internal) {
		if ( !options) {
			console.error(`Failed to get current options for ${currentType}, ${internal ? 'internal test' : ''}`);
			return;
		}
		let value, success = true;

		for (const name in obj.section) {
			value = options[name];

			if (dependableOpts.includes(name) && !isNullOrUndefined(value)) {
				console.log(`The dependable option '${name}' is set - ${value}. ${currentType}, ${internal ? 'internal test' : ''}`);
				success = false;
			}
		}
		this.logResults(`The 'dependable options test' test for ${currentType} is ${this.result(success)}`, success);
	},

	// tests generated code (not internal)
	codeBuilderTest : function() {
		let obj, json, options;

		for (const type in types) {
			tab.selectTab(type);
			tab.initializeEditors();

			this.jsons[type].every(json => {
				if (obj = Json.parseJson(json)) {
					this.addTestString(obj);
					importer.setOptions(obj);

					options = this.generateAndRunCode();

					if ( !options) return true;

					this.checkSetOptions(options, obj, false);
				}
				return true;
			});
		}
	},

	// improper added dependable option(s) in generated code can be misleading
	codeBuilderDependableTest : function() {
		let obj, json, options;

		for (const type in types) {
			tab.selectTab(type);
			tab.initializeEditors();

			if ( !(array = this.dependables[type])) continue;

			array.every(o => {
				if (obj = Json.parseJson(o.json)) {
					this.addTestString(obj);
					importer.setOptions(obj);

					options = this.generateAndRunCode();

					if ( !options) return true;

					this.checkDependableOptions(options, obj, o.options, false);
				}
				return true;
			});
		}
	},

	initialize : function(type, internal) {
		tab.selectTab(type);
		tab.initializeEditors();

		//resets all options to default value
		importer.resetOptions();

		if (internal) {
			tab.loadSearchParameter();
			tab.loadDefaultHtml();
			tab.updateCustomCode(codeBuilder.snippet);

		} else {
			this.clearCustomEditor(type);
		}
	},

	generateAndRunCode : function(obj) {
		let options,
			code = codeBuilder.build(currentLibrary.jquery ? 'jq' : 'js');
		code = code.replace(/'selector'/, `'article'`);
		// the generated code don't have 'options' object
		code = 'let options; ' + code.replace(/\{\n/, 'options = {\n') + '\nreturn options;';

		try { options = new Function('"use strict"; ' + code)(); } catch (e) {
			console.error(e.message);
			console.log(e.stack);
		}
		return options;
	},

	addTestString : function(obj) {
		obj.section['testString'] = { mode : 'html', content : '<p>Test string.</p>' };
	},

	// taken from https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects#answer-32922084
	/*isEquals : function(x, y) {
		if (isNullOrUndefined(x) || isNullOrUndefined(y)) return false;

		const keys = Object.keys;

		if (typeof x === 'object' && typeof x === typeof y) {
			return keys(x).length === keys(y).length && keys(x).every(key => this.isEquals(x[key], y[key]));
		}

		return x === y;
	},*/

	// to ease debugging
	isEquals : function(x, y) {
		if (isNullOrUndefined(x) || isNullOrUndefined(y)) {
			console.log('isNullOrUndefined', x, y);
			return false;
		}

		const keys = Object.keys;
		let success;

		if (typeof x === 'object' && typeof x === typeof y) {
			success = keys(x).length === keys(y).length && keys(x).every(key => this.isEquals(x[key], y[key]));

			if ( !success) console.log('typeof', keys(x).length + ' === ' + keys(y).length, x, y);
			return success;
		}

		success = x === y;

		if ( !success) console.log('x === y', x, y);
		return success;
	},

	clearCustomEditor : function(type) {
		const editor = types[type].customCodeEditor;
		if (editor) {
			editor.updateCode('');
		}
	},

	logResults : function(message, success) {
		if (success) {
			console.log(message);

		} else {
			console.error(message);
		}
	},

	result : function(success) {
		return success ? 'passed' : 'failed';
	}
};























