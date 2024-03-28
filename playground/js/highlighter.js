
const highlighter = {

	highlight : function() {
		tab.clear();
		setVariables();

		codeBuilder.build('js-jq');

		if (currentType === 'string_' || currentType === 'array') {
			this.markStringArray();

		} else if (currentType === 'regexp') {
			this.markRegExp();

		} else if (currentType === 'ranges') {
			this.markRanges();
		}
	},

	markContext : function(parameter, options, settings, fn) {
		settings.testContainer.unmark({
			'element' : '*',
			'iframes' : options.iframes,
			'shadowDOM' : options.shadowDOM,
			'done' : () => {
				time = performance.now();
				settings.context[fn](parameter, options);
			}
		});
	},

	markStringArray : function() {
		const parameter = this.getSearchParameter(currentType === 'array' ? 'Array' : 'String');
		if ( !parameter) return;

		const hl = this,
			settings = this.getCurrentSettings();

		const options = {
			'element' : settings.element,
			'className' : settings.className,
			'separateWordSearch' : settings.separateWordSearch,
			'diacritics' : settings.diacritics,
			'caseSensitive' : settings.caseSensitive,
			'ignoreJoiners' : settings.ignoreJoiners,
			'acrossElements' : settings.acrossElements,
			'combinePatterns' : settings.combinePatterns,
			'cacheTextNodes' : settings.cacheTextNodes,
			'shadowDOM' : settings.shadowDOM,
			'wrapAllRanges' : settings.wrapAllRanges,
			'blockElementsBoundary' : settings.blockElementsBoundary,

			'charSets' : settings.charSets,
			'accuracy' : settings.accuracy,
			'wildcards' : settings.wildcards,

			'synonyms' : settings.synonyms,
			'ignorePunctuation' : settings.ignorePunctuation,
			'exclude' : settings.exclude,

			'iframes' : settings.iframes,
			'iframesTimeout' : settings.iframesTimeout,

			/*'filter' : (node, term, marks, count, info) => {
				insideShadow = node.insideShadowRoot;
				return true;
			},*/
			'each' : (elem, info) => {
				hl.flagStartElement(elem, info);
			},
			'debug' : settings.debug,
			'done' : hl.finish,
			'noMatch' : (t) => { noMatchTerms.push(t); }
		};

		this.markContext(parameter, options, settings, 'mark');
	},

	markRegExp : function() {
		const regex = this.getSearchParameter('RegExp');
		if ( !regex) return;

		const hl = this,
			settings = this.getCurrentSettings();

		const options = {
			'element' : settings.element,
			'className' : settings.className,
			'acrossElements' : settings.acrossElements,
			'ignoreGroups' : settings.ignoreGroups,
			'separateGroups' : settings.separateGroups,
			'wrapAllRanges' : settings.wrapAllRanges,
			'shadowDOM' : settings.shadowDOM,
			'exclude' : settings.exclude,
			'blockElementsBoundary' : settings.blockElementsBoundary,
			'iframes' : settings.iframes,
			'iframesTimeout' : settings.iframesTimeout,

			/*'filter' : (node, match, totalMarks, info) => {
				return true;
			},*/
			'each' : (elem, info) => {
				hl.flagStartElement(elem, info);
			},
			'debug' : settings.debug,
			'done' : hl.finish,
			'noMatch' : (reg) => { noMatchTerms.push(reg); }
		};

		this.markContext(regex, options, settings, 'markRegExp');
	},

	markRanges : function() {
		const ranges = this.getSearchParameter('Ranges');
		if ( !ranges) return;

		const hl = this,
			settings = this.getCurrentSettings();

		const options = {
			'element' : settings.element,
			'className' : settings.className,
			'wrapAllRanges' : settings.wrapAllRanges,
			'shadowDOM' : settings.shadowDOM,
			'markLines' : settings.markLines,
			'exclude' : settings.exclude,
			'iframes' : settings.iframes,
			'iframesTimeout' : settings.iframesTimeout,

			/*'filter' : (node, range, match, counter) => {
				return true;
			},*/
			'each' : (elem, range, info) => {
				hl.flagStartElement(elem, info);
			},

			'debug' : settings.debug,
			'done' : hl.finish,
			'noMatch' : (o) => { noMatchTerms.push(JSON.stringify(o)); }
		};

		this.markContext(ranges, options, settings, 'markRanges');
	},

	highlightRawHtml : function(elem, text) {
		time = performance.now();
		tab.clear(true);
		setVariables();

		const markReg = new RegExp(`<\/?${markElement}([> ])`, 'g'),
			openReg = new RegExp(`data-markjs="([^"]+)"[^>]*>`, 'y'),
			stack = [];

		let totalMarks = 0,
			totalMatches = 0,
			data = '',
			html = '',
			number = '0',
			index = 0,
			match;

		// RegExp don't support balance groups, which makes it difficult to find open/close pairs of tags when mark elements are nested
		// this is a workaround
		while ((match = markReg.exec(text)) !== null) {
			let i = match.index;

			if (match[1] === '>' && stack.length) {
				data = stack.pop();

				if (index < i) {
					html += wrap(index, i, data, true);
				}

				index = markReg.lastIndex;
				html += wrap(i, index, data) + `</mark>`;

			} else if (match[1] === ' ') {
				openReg.lastIndex = markReg.lastIndex;

				if ((match = openReg.exec(text)) !== null) {
					if (index < i) {
						html += stack.length ? wrap(index, i, data, true) : util.entitize(text.substring(index, i));
					}

					data = match[1];

					if (data === 'start-1') {
						data = 'true';
						totalMatches++;

					} else if (canBeNested && data > number) {
						number = data;
					}

					markReg.lastIndex = index = openReg.lastIndex;
					html += `<mark data-markjs="${match[1]}" class="mark-element">` + wrap(i, index, data);

					stack.push(data);
					totalMarks++;
				}
			}
		}

		function wrap(start, end, data, term) {
			return `<mark data-markjs="${data}"${term ? ' class="mark-term"' : ''}>${util.entitize(text.substring(start, end))}</mark>`;
		}

		if (index < text.length) {
			html += util.entitize(text.substring(index, text.length));
		}

		if (canBeNested && number !== '0') {
			totalMatches = parseInt(number) + 1;
		}

		elem.innerHTML = html;

		markElement = 'mark';
		markElementSelector = `mark[data-markjs]`;

		this.finish(totalMarks, totalMatches, null);
	},

	flagStartElement : function(elem, info) {
		if (canBeNested) {
			$(elem).attr('data-markjs', info ? info.count - 1 : matchCount++);

		} else if (flagEveryElement || !info || info.matchStart) {
			$(elem).attr('data-markjs', 'start-1');
		}
	},

	getCurrentSettings : function() {
		// disable contenteditable attribute for performance reason
		tab.setEditableAttribute(false);

		const obj = {};

		obj.context = this.getTestContexts();
		obj.testContainer = this.getTestContainer();

		obj.element = $(`${optionPad} .element input`).val().trim();
		obj.className = $(`${optionPad} .className input`).val().trim();

		obj.exclude = this.tryToEvaluate('exclude', 3) || [];
		obj.debug = tab.isChecked('debug');

		obj.iframes = tab.isChecked('iframes');
		if (obj.iframes) {
			obj.iframesTimeout = tab.getNumericalValue('iframesTimeout', 5000);
		}

		if (currentType === 'string_' || currentType === 'array') {
			obj.separateWordSearch = tab.isChecked('separateWordSearch');
			if (obj.separateWordSearch) {
				const val = $(`${optionPad} .separateWordValue select`).val();
				obj.separateWordSearch = val === 'preserveTerms' ? val : true;
			}
			obj.diacritics = tab.isChecked('diacritics');
			obj.caseSensitive = tab.isChecked('caseSensitive');
			obj.charSets = tab.isChecked('charSets');
			obj.ignoreJoiners = tab.isChecked('ignoreJoiners');

			obj.accuracy = $(`${optionPad} .accuracy select`).val();
			obj.wildcards = $(`${optionPad} .wildcards select`).val();

			obj.synonyms = this.tryToEvaluate('synonyms', 8) || {};
			obj.ignorePunctuation = this.tryToEvaluate('ignorePunctuation', 3) || [];

			if (isAccuracyValue(obj.accuracy)) {
				const accuracy = this.tryToEvaluate('accuracyObject', 30);
				if (accuracy) {
					obj.accuracy = accuracy;
				}
			}

		} else if (currentType === 'regexp') {
			obj.separateGroups = tab.isChecked('separateGroups');

			if ( !obj.separateGroups) {
				obj.ignoreGroups = tab.getNumericalValue('ignoreGroups', 0);
			}
		}

		if (currentType !== 'ranges') {
			obj.acrossElements = tab.isChecked('acrossElements');
		}

		const shadowDOM = tab.isChecked('shadowDOM');
		if (shadowDOM) {
			const styleObj = this.tryToEvaluate('shadowStyle', 16);
			if (styleObj) {
				obj.shadowDOM = styleObj;

			} else {
				obj.shadowDOM = true;
			}
		}

		if (obj.acrossElements && currentType !== 'ranges') {
			const boundary = tab.isChecked('blockElementsBoundary');
			if (boundary) {
				const blockElements = this.tryToEvaluate('blockElements', 5);
				if (blockElements) {
					obj.blockElementsBoundary = blockElements;

				} else {
					obj.blockElementsBoundary = true;
				}
			}
		}

		if (currentType === 'regexp' && tab.isChecked('separateGroups') || currentType === 'ranges') {
			obj.wrapAllRanges = tab.isChecked('wrapAllRanges');
		}

		if (currentType === 'ranges') {
			obj.markLines = tab.isChecked('markLines');
		}

		if (markArray()) {
			obj.cacheTextNodes = tab.isChecked('cacheTextNodes');

			const combine = tab.isChecked('combinePatterns');
			if (combine) {
				obj.combinePatterns = tab.getNumericalValue('combineNumber', 10);
			}
		}

		return obj;
	},

	tryToEvaluate : function(option, minLength) {
		const editor = tab.getOptionEditor(option);
		let text;

		if (editor) {
			text = editor.toString().trim();

			if (text.length >= minLength) {
				try {
					return new Function('"use strict"; return (' + text + ')')();

				} catch (e) {
					log(`Failed to evaluate ${option} object:\n${e.message}`, true);
					$(`${optionPad} .${option} .editor`).addClass('error');
				}

			} else if (text) {
				log(`Skips evaluating ${option} object due to suspicious length.`, false, true);
				$(`${optionPad} .${option} .editor`).addClass('warning');
			}
		}
		return null;
	},

	getSearchParameter : function(name, selector) {
		const info = tab.getSearchEditorInfo();
		let parameter = info.editor.toString(),
			result;
		if ( !parameter.trim()) return null;

		if (currentType === 'string_') {
			parameter = util.stringify(parameter);
		}

		try {
			result = new Function('"use strict"; return (' + parameter + ')')();

		} catch (e) {
			log(`Failed to evaluate the ${name}:\n${e.message}`, true);
			$(selector).addClass('error');
			return null;
		}
		return result;
	},

	getTestContexts : function() {
		const elem = tab.getTestElement(),
			info = tab.getSelectorsEditorInfo(),
			selectors = info.editor.toString().trim();
		let elems = elem;

		if (selectors) {
			elems = $(info.all).prop('checked') ? elem.querySelectorAll(selectors) : elem.querySelector(selectors);
		}

		return new Mark(elems);
	},

	getTestContainer : function() {
		const elem = tab.getTestElement();

		return new Mark(elem);
	},

	getMarkElements : function() {
		const elem = tab.getTestElement();
		let markElements;

		if (tab.isChecked('shadowDOM')) {
			const className = types[currentType].testEditorMode === 'text' ? $(`${optionPad} .className input`).val().trim() : null;
			markElements = this.collectMarkElements(elem, className);

		} else {
			markElements = elem.querySelectorAll(markElementSelector);
		}
		return $(markElements);
	},

	collectMarkElements : function(root, className) {
		var elements = [];

		var loop = function(node) {
			while (node) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					if (node.nodeName.toLowerCase() === markElement && node.hasAttribute('data-markjs')) {
						if ( !className || node.classList.contains(className)) elements.push(node);
					}

					if (node.shadowRoot && node.shadowRoot.mode === 'open') {
						if (node.shadowRoot.firstChild) {
							loop(node.shadowRoot.firstChild);
						}
					}

					if (node.nodeName.toLowerCase() === 'iframe') {
						try {
							let body, doc = node.contentWindow.document;

							if (doc && (body = doc.querySelector('body')) && body.hasChildNodes()) {
								loop(body.firstChild);
							}
						} catch (e) { }
					}
				}

				if (node.hasChildNodes()) {
					loop(node.firstChild);
				}
				node = node.nextSibling;
			}
		};

		loop(root.firstChild);

		return elements;
	},

	finish : function(totalMarks, totalMatches, termStats) {
		matchCount = totalMatches || totalMarks;

		let matches = totalMatches ? `totalMatches = ${totalMatches}\n` : '',
			totalTime = (performance.now() - time) | 0,
			array = util.distinct(noMatchTerms.flat()),    // with an 'iframes' option mark.js can call 'done' callback multiple times
			len = array.length,
			span = '<span class="header">',
			text = currentType === 'regexp' ? 'No match' : (currentType === 'ranges' ? 'Not valid range' : 'Not found term') + (len > 1 ? 's' : '');
		noMatch = len ? `\n\n${span}${text} : </span>${array.join('<b>,</b> ')}` : '',
			stats = termStats ? highlighter.writeTermStats(termStats, `\n\n${span}Terms stats : </span>`) : '';

		log(`Mark time = ${totalTime} ms\n${matches}totalMarks = ${totalMarks}${stats}${noMatch}\n${'--'.repeat(10)}`);

		marks = highlighter.getMarkElements();

		if (marks.length > 0) {
			if (markElement !== 'mark') {
				marks.addClass('custom-element');
			}

			if (canBeNested) {
				highlightMatch2();

			} else {
				startElements = marks.filter((i, elem) => $(elem).data('markjs') === 'start-1');
				// synchronizes current match in both 'text' and 'html' modes
				let elem;
				if (currentIndex !== -1 && (elem = startElements.eq(currentIndex)).length) {
					highlightMatch(elem);

				} else {
					highlightMatch(marks.first());
				}
			}
		}

		// restore contenteditable attribute
		tab.setEditableAttribute(true);
	},

	writeTermStats : function(obj, title) {
		let array = [];
		for (let key in obj) {
			if (obj[key] !== 0) {
				array.push(`'${key}' = ${obj[key]}`);
			}
		}
		return array.length ? title + array.join('<b>,</b> ') : '';
	}
};























