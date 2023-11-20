
(function($) {
	const debug = false,
		preserveTerms = true,
		showSearchScore = false,
		scrollIntoViewOnSettingChange = false,
		autoCopySelection = false;
	let searchStartsWith = true;

	$(document).ready(function() {
		const locationSearch = location.search,
			hasHash = location.hash.length > 2,
			srcCode = /^.+\/(?:mark|domiterator|regexpcreator).html$/.test(location.pathname),
			name = location.pathname.replace(/^.+\/([^/]+)\.html?/i, '$1'),
			addPageHeaders = true,
			isApiPage = /-method$/.test(name),
			isSearchFile = name === '$search';

		let selected = false,
			allow = false,
			shiftKey = false,
			currentItem = $(),
			pageHeaders = [],
			//marginLeft = 280,
			headersMenu,
			id;

		let t0 = performance.now();

		renderSidebar();

		if (addPageHeaders) {
			if (srcCode) buildMethodsMenu();
			else buildHeadersMenu();
		}

		renderSearchBar();
		registerEvents();
		handleWidth();

		if (hasHash) {
			let hash = decodeURIComponent(location.hash.substring(1)),
				elem = $('#' + hash).first();

			if (elem.length) {
				if (elem.is('h1,h2,h3,h4,tr,span')) {
					elem.addClass('hd-current');
					id = elem.attr('id');
				}
				scrollTo(elem, 100, highlightMenuItem());
			}
		}

		function highlightMenuItem() {
			if (id && headersMenu && headersMenu.length) {
				findCurrentItem(id);
			}
		}

		console.log(performance.now() - t0);

		function findCurrentItem(id) {
			let change = false;
			headersMenu.each((i, elem) => {
				if ($(elem).data('id') == id) {
					if ($(elem).hasClass('span-current')) return false;

					headersMenu.removeClass('span-current');
					$(elem).addClass('span-current');
					change = true;
					return false;
				}
			});
			return change;
		}

		function renderSidebar() {
			let sidebarToc = $('nav.sidebar .toc');
			sidebarToc.html(toc);
			currentItem = $('nav.sidebar .toc a[href="' + name + '.html"]').addClass('current');

			columnHeight();

			if (currentItem.length) {
				let parents = currentItem.parents('ul');
				if (parents.length) {
					parents.show();

					let parentsLi = currentItem.parents('li');
					parentsLi.children('div.collapsed, div.close').each((i, elem) => {
						if ($(elem).hasClass('collapsed')) $(elem).removeClass('collapsed').addClass('expanded');
					});
				}
				let li = currentItem.parent();
				li.children('ul').show();
			}
		}

		function renderSearchBar() {
			const maxSearchLength = 256,
				searchButton = $('form.search-bar .advanced-search'),
				wholeWordButton = $('form.search-bar .whole-word'),
				highlightAllButton = $('form.search-bar .highlight-all');
			let searchPage = false,
				hasSearch = false,
				highlightAll = false,
				searchWholeWord = false,
				shiftKey = false,
				query = '',
				currentTerm,
				marks, startElements, searchSetting;

			if (window.location.search.length > 3) {
				let params = getQueryParameters();
				if (params.q && !/^\d+$/.test(params.q)) {
					query = normalize(params.q);
				}
				hasSearch = query.length > 0;

				if (params.s) {
					searchSetting = params.s;
					if (searchSetting && Number(parseInt(searchSetting)) == searchSetting) {
						searchSetting = (searchSetting | 0);
					}
				}
			}

			setSearchSettings();
			setSearchBar(hasSearch, searchPage);
			registerEvents();

			if (hasSearch) {
				highlightSearchWords(query, !isSearchFile);
				if ( !isSearchFile) $("input#q").val(query);
			}

			function highlightSearchWords(query, scroll) {
				const instance = new Mark(document.querySelectorAll(isSearchFile ? 'div.results' : 'article')),
					limiters = ",.;:?!'\"()[]{}",
					exactly = { value : "exactly", limiters },
					startsWith = { value : "startsWith", limiters };

				const options = {
					diacritics : false,
					separateWordSearch : preserveTerms ? 'preserveTerms' : true,
					accuracy : searchWholeWord ? exactly : startsWith,
					acrossElements : true,
					blockElementsBoundary : isSearchFile,
					combinePatterns : Infinity,

					filter : (elem, curTerm) => {
						currentTerm = curTerm;
						return true;
					},
					each : (elem, info) => {
						if (info.matchStart) {
							elem.className = 'start-1';
						}
						elem.classList.add(/ /.test(currentTerm) ? 'term' : 'word');
					},

					debug : true,
					done : finish,
					noMatch : (term) => { if (debug) console.log(term + '  X'); },
				};

				let run = 0;

				instance.unmark({
					done : () => {
						run = 1;
						instance.mark(query, options);
					}
				});

				function finish(totalMark, totalMatch) {
					if (totalMark === 0 && run === 1) {
						run++;
						options.separateWordSearch = true;
						options.accuracy = searchWholeWord ? exactly : searchStartsWith ? startsWith : 'partially';
						instance.mark(query.replace(/"/g, ''), options);
					}

					if (totalMatch > 0) {
						marks = $('mark');

						if (highlightAll) marks.addClass('show');

						displayFirst(query, scroll);
					}
					searchButton.text(totalMatch);
				}
			}

			function displayFirst(query, scroll) {
				let elem;

				// it not so easy find first preserve term with acrossElements option
				if (preserveTerms) {
					let splits = splitsQuery(query);

					for (let i = 0; i < splits.length; i++) {
						if (/ /.test(splits[i])) {
							let reg = getSearchRegex(splits[i], true),
								str = '', add = false, prevElem;

							marks.each((i, el) => {
								if ($(el).hasClass('start-1')) {
									if (reg.test(str)) {
										elem = prevElem ? $(prevElem) : $(el);
										return false;
									}
									str = el.textContent.toLowerCase();
									prevElem = el;
									add = true;

								} else if (add) str += el.textContent.toLowerCase();
								else add = false;
							});
						}
						if (elem) break;
					}
				}

				if ( !elem) {
					elem = $('mark.start-1').first();
				}

				if (elem.length) {
					highlightCurrentMatch(elem, true);

					if ( !hasHash && scroll) scrollTo(elem, 100);
					setTimeout(function() { findCurrentIndex(true); }, 120);
				}
			}

			function registerEvents() {

				$('body').on('keypress', function(e) {
					if (shiftKey && e.keyCode === 70) {    //F
						e.preventDefault();

						setInputBoxSearchOptions();
						setSearchBar(true, true);
						searchCurrentPage();
						shiftKey = false;
					}
				}).on('keydown', function(e) {
					if (e.shiftKey) shiftKey = true;
				}).on('keyup', function(e) {
					shiftKey = false;
				});

				searchButton.on('click', function() {
					searchPage = settings.toggleAdvancedSearch(isSearchFile);
					$(this).toggleClass('on', searchPage);

					if (searchPage) {
						if (isSearchFile) {
							setSearchBar(true, true);
							highlightWords(true);

						} else {
							setLocalSettings(true, true);
							highlightWords(false);
						}

					} else if (hasSearch) {
						if (isSearchFile) location.reload();
						else {
							setLocalSettings(false, false);
							highlightWords(false);
						}

					} else {
						setSearchBar(searchPage, false);
					}
				});

				highlightAllButton.on('click', function() {
					highlightAll = settings.toggleHighlightAll(isSearchFile);
					$(this).toggleClass('on', highlightAll);

					highlightWords(isSearchFile);
				});

				wholeWordButton.on('click', function() {
					searchWholeWord = settings.toggleWholeWord(isSearchFile);
					$(this).toggleClass('on', searchWholeWord);

					highlightWords(isSearchFile);
				});
			}

			function highlightWords(reload) {
				if (reload) location.reload();
				else if (hasSearch) {
					highlightSearchWords(query, scrollIntoViewOnSettingChange);
				}
			}

			function setInputBoxSearchOptions() {
				settings.getSearchSetting(isSearchFile, true);
				settings.localSearch = settings.setLocalFlag(settings.localSearchFlag, true);

				searchPage = true;
				searchButton.toggleClass('on', searchPage);

				highlightAll = settings.localHighlightAll;
				highlightAllButton.toggleClass('on', highlightAll);
			}

			function setLocalSettings(on, highlightAll) {
				if (searchSetting) {
					// shift left number to apply search file settings to the current page settings
					settings.localSettingValue = searchSetting << 1;

					let all = highlightAll && (searchSetting & settings.highlightAllFlag) !== 0;
					settings.localHighlightAll = settings.setLocalFlag(settings.localHighlightAllFlag, all);
				}
				settings.localSearch = settings.setLocalFlag(settings.localSearchFlag, on);
				setOptions();
				setSearchBar(true, on);
			}

			function setSearchSettings() {
				if (searchSetting) {
					// shift left number to apply search file settings to the current page settings
					settings.localSettingValue = searchSetting << 1;

					if ((searchSetting & settings.advancedSearchFlag) === 0 && (searchSetting & settings.highlightAllFlag) !== 0) {
						settings.localHighlightAll = settings.setLocalFlag(settings.localHighlightAllFlag, false);
					}
				}
				setOptions();
			}

			function setOptions() {
				settings.getSearchSetting(isSearchFile, true);

				searchPage = isSearchFile ? settings.advancedSearch : settings.localSearch;
				searchButton.toggleClass('on', searchPage);

				highlightAll = isSearchFile ? settings.highlightAll : settings.localHighlightAll;
				highlightAllButton.toggleClass('on', highlightAll);

				searchWholeWord = isSearchFile ? settings.wholeWord : settings.localWholeWord;
				wholeWordButton.toggleClass('on', searchWholeWord);
			}

			function setSearchBar(show, expand) {
				$('form.search-bar').css('display', show ? 'block' : 'none');

				if (show && expand) {
					$('form.search-bar').addClass('on');
					searchButton.attr('title', 'Disable highlighting');

				} else {
					$('form.search-bar').removeClass('on');
					searchButton.text('');
					searchButton.attr('title', 'Highlight');
				}

				$('form.search-bar .control-block').css('display', expand ? 'block' : 'none');
			}

			function findCurrentIndex(refresh) {
				const top = $(window).scrollTop() + 120;
				let length, index = -1;

				if (refresh || !startElements) filterElements();

				length = startElements.length;
				if (length) {
					if (startElements.first().offset().top > (top + 1)) {
						index = 0;

					} else if (startElements.last().offset().top < top - 120) {
						index = length;

					} else {
						startElements.each((i, elem) => {
							if ($(elem).offset().top > top) {
								index = i;
								return false;
							}
						});
						if (index === -1) index = length;
					}
				}
			}

			function filterElements() {
				marks = $('mark');
				startElements = marks.filter((i, elem) => $(elem).hasClass('start-1'));
			}

			function highlightCurrent(elem) {
				if ( !highlightAll) marks.removeClass('show');
				marks.removeClass('current');

				highlightCurrentMatch(elem, false);
			}

			function highlightCurrentMatch(elem, show) {
				let add = false;
				marks.each((i, el) => {
					if ( !add) {
						if (el === elem[0]) add = true;

					} else if ($(el).hasClass('start-1')) return false;

					if (add) {
						if (show) $(el).addClass('show');
						else {
							if ( !highlightAll) $(el).addClass('show');

							$(el).addClass('current');
						}
					}
				});
			}
		}

		function registerEvents() {

			$(window).on('scroll', function() {
				if (allow && pageHeaders.length && headersMenu.length) {
					allow = false;
					const top = $(window).scrollTop(),
						height = $(window).height(),
						bottom = top + height - 100,
						half = top + height / 2,
						elems = pageHeaders.get(),
						len = elems.length;
					let change = false, pos, id;

					for (let i = 0; i < len; i++) {
						pos = elems[i].offsetTop;

						if (pos > top && pos < half || pos < top && i + 1 < len && ((pos = elems[i + 1].offsetTop) > half && pos < bottom)) {
							id = elems[i].id;
							if ( !id) continue;

							change = findCurrentItem(id);
							break;
						}
					}
					if ( !change && elems[0].offsetTop > bottom) headersMenu.removeClass('span-current');
					setTimeout(function() { allow = true; }, 50);
				}
			});

			$('.sidebar .toc li>span.generated').on('click', function() {
				handleWidth();

				allow = false;
				const id = $(this).attr('data-id');
				pageHeaders.removeClass('hd-current');

				pageHeaders.each(function() {
					if (id == $(this).attr('id')) {
						scrollTo($(this), 100);
						$(this).addClass('hd-current');
						return false;
					}
				});
				headersMenu.removeClass('span-current');
				$(this).addClass('span-current');
				setTimeout(function() { allow = true; }, 100);
			});

			$('.sidebar .toc li div').on('click', function() {
				expandCollapse($(this));
			});

			$('.sidebar .toc li span:not(.generated)').on('click', function() {
				expandCollapse($(this).prev('div'));

				let parLi = $(this).parents('li').eq(1);

				if ( !parLi.children('a').first().hasClass('current')) {
					let href = parLi.children('a').first().attr('href');
					if (href) {
						location.replace(href + '#' + id);
					}
				}
			});

			$(".sidebar .toc li a").on('click', function() {
				let attrHref = $(this).attr('href');

				currentItem.removeClass('current');
				currentItem = sidebarToc.find('a[href="' + attrHref + '"]').first();
				if (currentItem.length) currentItem.addClass('current');

				let prevAr = $(this).prev('div');
				if (prevAr.length) expandCollapse(prevAr);

				//highlightSection(attrHref);
				displayMenuButton();
			});

			$(".search-info .button").on('click', function() {
				$('.search-info .info').css('display', 'block');
				$('.search-results').empty();
			});

			$("form #q").one('click', function() {
				if ( !selected) {
					selected = true;
					$(this).select();
				}
			}).on('focusout', function() {
				selected = false;
			});

			$('header #menu').on('click', function() {
				toggleSidebar(true);
			});

			$('.up-btn').on('click', function() {
				$('html, body').animate({ scrollTop : 0 }, 50);
			});

			$('.down-btn').on('click', function() {
				let h = $(document).height();
				$('html, body').animate({ scrollTop : h }, 50);
			});

			$("span.copy-code").on('mouseup', function(e) {
				document.getSelection().selectAllChildren($(this).parent()[0]);
				document.execCommand('copy');
				document.getSelection().removeAllRanges();
			});

			$('#wrapper').on('mouseup', function(e) {
				let sel = copySelection();
				if (sel !== '' && e.ctrlKey) {
					$('form #q').val(sel);
				}
			});

			$(window).on('resize', function() {
				handleWidth();
				columnHeight();
			});

			$("a[href^='#']").on('mouseenter', function(e) {
				showTooltip($(this).attr('href').substring(1), $(this), e);
			}).on('mouseleave', function() {
				$(this).powerTip('hide', true);
			});
		}

		function showTooltip(id, elem, e) {
			elem.data('powertiptarget', id).powerTip({
				manual : true,
				intentPollInterval : 300,
				fadeInTime : 100,
				smartPlacement : true,
				placement : 'w',
				offset : 30
			});
			elem.powerTip('show', e);
		}

		function buildMethodsMenu() {
			let parentLi = currentItem.parents('li:first');
			if ( !parentLi.length) return;

			let reg = /(?:\n[ ]*(?:(?:static|([gs]et))[ ]+)?(?!(?:if|for|while|switch)\b)(\w+)(?=[ ]*\(.*\)[ ]*\{[ ]*\n))|\n/gd,
				menu = '',
				method = '', id;

			new Mark($('pre')[0]).markRegExp(reg, {
				'element' : 'span',
				'className' : 'func',
				'acrossElements' : true,
				'separateGroups' : true,
				'filter' : (n, t, m, info) => {
					if (info.matchStart) {
						if (info.match[2]) {
							method = (info.match[1] ? info.match[1] + ' ' : '') + info.match[2];
							id = method.replace(/\W+/g, '-').toLowerCase();
							menu += '<li><span class="generated" data-id="' + id + '">' + method + '</span></li>';
						}
					}
					return true;
				},
				'each' : (markElement, info) => {
					if (info.matchStart) markElement.id = id;
				},
			});

			if (menu.length) {
				addMenu(menu, parentLi);
				pageHeaders = $('article').find('span[class=func][id]');
			}
		}

		function buildHeadersMenu() {
			let parentLi = currentItem.parents('li:first');
			if (parentLi.length) {
				let menu = '',
					num = -1;
				pageHeaders = $('article').find('h1[id], h2[id], h3[id], h4[id]');

				pageHeaders.each((i, elem) => {
					if (++num == 0) return true;

					let text = $(elem).text();
					if (text.length) {
						let id = $(elem).attr('id');

						if ( !id) {
							id = Math.random().toString().replace(/\./g, '');
							$(elem).attr('id', id);
						}
						text = text.replace('<', '&lt;').replace('>', '&gt;');
						menu += '<li><span class="generated ' + $(elem)[0].tagName.toLowerCase().replace('h', 'hd') + '" data-id="' + id + '">' + text + '</span></li>';
						$(elem).attr('id', id);
					}
				});
				if (menu.length) {
					addMenu(menu, parentLi);
				}
			}
		}

		function addMenu(menu, parentLi) {
			$('.sidebar .toc ul.page-headers').remove();

			$('<ul class="page-headers">' + menu + '</ul>').insertAfter(parentLi.children('a').first());
			headersMenu = parentLi.find('span.generated');
			allow = true;
		}

		function highlightCodeLine(pre, line) {
			let elem;
			const instance = new Mark(pre);
			instance.unmark({
				'done' : () => {
					instance.markRanges([{ start : line, length : 1 }], {
						'markLines' : true,
						'each' : (markElement, range, info) => {
							if (info.matchStart) elem = markElement;
							markElement.className = 'mark-range';
						},
						'done' : () => {
							if (elem) scrollTo($(elem), 100);
						}
					});
				}
			});
		}

		function showBoth() {
			const width = $(window).width();
			return isApiPage && width > 1000 || !isApiPage && width > 800;
		}

		function handleWidth() {
			if (showBoth()) setBoth();
			else toggleSidebar(false);

			displayMenuButton();
		}

		function getMargin() {
			const width = $(window).width();
			let marginLeft = width < 1280 ? 310 : 380;
			return marginLeft;
		}

		function setBoth() {
			const marginLeft = getMargin();
			$('div.nav-wrap, main').css('display', 'block');
			$('div.nav-wrap, nav.sidebar').css('width', (marginLeft - 20) + 'px');
			$('main').css('margin-left', marginLeft + 'px').css('margin-top', '0px');
		}

		function toggleSidebar(on) {
			const marginLeft = getMargin();

			$('div.nav-wrap').css('display', on ? 'block' : 'none');
			$('header #menu, main').css('display', on ? 'none' : 'block');
			$('main').css('margin-left', on ? marginLeft + 'px' : '0px').css('margin-top', on ? '0px' : '50px');
			$('article').css('padding-left', on ? '10px' : '10px');
		}

		function displayMenuButton() {
			$('header #menu').css('display', showBoth() ? 'none' : 'block');
		}

		function scrollIntoView(elem, scroll) {
			if (isSearchFile && !scroll) return;
			scrollTo(elem, 100);
		}

		function expandCollapseSpan(arrow) {
			if (arrow.hasClass('open')) { arrow.removeClass('open').addClass('close'); }
			else if (arrow.hasClass('close')) { arrow.removeClass('close').addClass('open'); }
			arrow.parent().children('ul').toggle();
		}

		function expandCollapse(arrow) {
			let par = arrow.parent();
			par.find('ul').toggle();
			par.find('div').each((i, elem) => { toggleArrow($(elem)) });

		}

		function toggleArrow(arrow) {
			if (arrow.hasClass('expanded')) {
				if (arrow.hasClass('asm')) arrow.removeClass('expanded');
				else arrow.removeClass('expanded').addClass('collapsed');

			} else arrow.filter("collapsed").removeClass('collapsed').addClass('expanded');
		}
	});

	function scrollTo(elem, delay, done) {
		const pos = elem.offset().top - 120;
		$('html, body').animate({ scrollTop : pos }, delay, done);
	}

	function columnHeight() {
		const h = $(window).height();
		$('.buttons').css('top', h * 3 / 5);
		$('nav.sidebar .toc').css('height', h - 35);
	}

	function copySelection() {
		let sel = document.getSelection().toString();
		if ( !sel) return '';
		if (autoCopySelection) document.execCommand('copy');
		sel = normalize(sel);
		return sel.length < 128 ? sel : '';
	}

	function normalize(str) {
		const reg = new RegExp("['\\u2018\\u2019][st]\\b|" + (preserveTerms ? '[^"\\w]+' : '\\W+'), 'gi');
		return str.replace(reg, ' ').trim().toLowerCase();
	}

	function trim(query) {
		return query.replace(/^[\s\W]+|[\s\W]+$/g, '');
	}

	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function splitsQuery(query) {
		const array = [],
			split = str => {
				str.split(/ +/).forEach(word => add(word));
			},
			add = term => {
				if (term && array.indexOf(term) === -1) {
					array.push(term);
				}
			};

		if (preserveTerms) {
			query.split(/"("*[^"]+"*)"/).forEach((term, i) => {
				if (i % 2 > 0) {
					add(term);

				} else {
					split(term);
				}
			});

		} else {
			split(query);
		}
		return array;
	}

	function splitsBySpace(query) {
		return query.split(/[" ]+/).filter(elem => elem.length > 0);
	}

	function unique(a) {
		const len = a.length,
			array = [];
		for (let i = 0; i < len; ++i) {
			if (array.indexOf(a[i]) === -1) array.push(a[i]);
		}
		return array;
	};

	function getQueryParameters() {
		const parameters = {},
			search = decodeURIComponent(window.location.search.substr(1)),
			splits = search.replace(/\+/g, ' ').split(/[&;]/);

		splits.forEach((item) => {
			const p = item.split(/=/, 2);
			parameters[p[0]] = p[1];
		});
		return parameters;
	}

	function getPageContent(i) {
		return Info ? Info[i][0] : null;
	}

	function getPages(terms, isPhrase, termsInfo) {
		let score = {},
			termsScore = 1,
			flag = 1,
			count,
			searchType,
			term;

		for (let i = 0; i < terms.length; i++) {
			term = terms[i];
			count = 0;
			searchType = '';

			if (SearchIndex[term]) {
				const num = initScore(SearchIndex[term]);
				if (settings.wholeWord) {
					count += num;
					searchType = 'Whole word';
				}
			}

			if ( !settings.wholeWord && term.length > 1) {
				for (let si in SearchIndex) {
					if (searchStartsWith) {
						if (si.startsWith(term)) {    // start with
							count += initScore(SearchIndex[si]);
							searchType = 'Starts with';
						}

					} else {
						if (si.indexOf(term) !== -1) {    // contains
							count += initScore(SearchIndex[si]);
							searchType = 'Contains';
						}
					}
				}
			}

			termsInfo[term] = { score : count, searchType };

			termsScore |= flag;
			flag <<= 1;
		}

		function initScore(indices) {
			const length = indices.length;

			for (let j = 0; j < length; j++) {
				const index = indices[j],
					page = score[index],
					count = indices[++j];

				if ( !page) {
					score[index] = { termsScore : flag, count : count };

				} else {
					page.termsScore |= flag;
					page.count += count + 1;
				}
			}
			return length;
		}

		if (isPhrase) termsScore >>= 1;

		const result = {};
		for (let page in score) {
			if (score[page].termsScore >= termsScore) result[page] = score[page];
		}

		return result;
	}

	function getSearchResults(query) {
		const wholeWord = settings.wholeWord,
			termsInfo = {},
			results = [],
			splits = splitsQuery(query);

		splits.forEach(part => {
			const terms = unique(splitsBySpace(part)),
				isPhrase = / /.test(part),
				pages = getPages(terms, isPhrase, termsInfo),
				wordsReg = getSearchRegex(part, false);
			let wordRegs, phraseReg, phraseFound, num, count, lastIndex;

			if (isPhrase) {
				phraseReg = getSearchRegex(part, true);
				wordRegs = getWordRegexes(part);

			} else {
				wordRegs = [wordsReg];
			}

			for (let index in Headers) {
				const array = Headers[index];
				if ( !array) continue;

				for (let i = 0; i < array.length; i++) {
					let rm, header = array[i][0], type = array[i][1];

					num = 0;
					phraseFound = false;

					if (isPhrase) {
						phraseReg.lastIndex = 0;

						if ((rm = phraseReg.exec(header)) !== null) {
							let pow = Math.pow(type, type);

							if (rm.index === 0) {
								if (rm[0].length === header.length) num += pow * 1000;
								else num += pow * 500;

							} else num += pow * 250;

							phraseFound = true;
						}
					}

					if (isPhrase && !phraseFound) continue;

					if ( !phraseFound) {
						wordsReg.lastIndex = 0;

						if ((rm = wordsReg.exec(header)) !== null) {
							let reg, multiplier = 1, pow = Math.pow(type, type);

							if (rm.index === 0) {
								if (rm[0].length === header.length) num += pow * 200;
								else num += pow * 50;

							} else num += pow * 30;

							for (let k = wordRegs.length - 1; k >= 0; k--) {
								reg = wordRegs[k];
								reg.lastIndex = 0;

								if (reg.test(header)) {
									num += 10 * pow * multiplier;
									multiplier *= 5;
								}
							}
						}
					}

					if (num > 0) {
						results.push({
							index : index,
							url : Pages[index][0],
							title : Pages[index][1],
							lastIndex : -1,
							score : num,
							isPhrase : phraseFound,
							header : [{ text : header, level : 6 - type, id : array[i][2] }]
						});
					}
				}
			}

			for (let index in pages) {
				const content = getPageContent(index);

				num = pages[index].count;
				phraseFound = false;
				lastIndex = -1;

				if (content != null) {
					if (isPhrase) {
						phraseReg.lastIndex = 0;

						if (phraseReg.test(content)) {
							if (phraseReg.lastIndex <= content.length) lastIndex = phraseReg.lastIndex;
							count = countMatches(content, phraseReg);
							num += 5000 * count;
							phraseFound = true;
						}
					}

					if (isPhrase && !phraseFound) continue;

					wordsReg.lastIndex = 0;
					if (lastIndex === -1 && wordsReg.test(content)) {
						if (wordsReg.lastIndex <= content.length) lastIndex = wordsReg.lastIndex;
					}
				}

				results.push({
					index : index,
					url : Pages[index][0],
					title : Pages[index][1],
					lastIndex : lastIndex,
					score : num,
					isPhrase : phraseFound,
				});
			}

			if (debug) {
				console.log(' Search regs: phrase - ' + getSearchRegex(part, true) + '   words - ' + getSearchRegex(part, false) + '   wordsReg - ' + wordRegs);
			}
		});

		function countMatches(text, reg) {
			const array = text.match(reg);
			return array === null ? 0 : array.length;
		}

		function getWordRegexes(query) {
			//const words = unique(splitsBySpace(query).filter(wd => Common[wd] !== 1)),
			const words = unique(splitsBySpace(query)),
				array = [];

			for (let i = 0; i < words.length; i++) {
				array.push(new RegExp((wholeWord || searchStartsWith ? '\\b' : '') + words[i] + (wholeWord ? '\\b' : ''), 'gi'));
			}
			return array;
		}

		return { results, termsInfo };
	}

	function getSearchRegex(query, phrase) {
		const wholeWord = settings.wholeWord,
			words = splitsBySpace(query);
		let regString;

		if (words.length === 1) regString = (wholeWord || searchStartsWith ? '\\b' : '') + words[0] + (wholeWord ? '\\b' : '');
		else {
			const start = wholeWord || searchStartsWith ? '\\b(?:' : '(?:',
				end = wholeWord ? ')\\b' : ')',
				ending = (wholeWord ? '' : '(?:\\w+)?');

			if (phrase) regString = start + words.join(ending + '[^\\u220E\\w]+') + ending + end;
			else regString = start + unique(words.filter(wd => Common[wd] !== 1)).join('|') + end;
		}
		return new RegExp(regString, 'gi');
	}

	function performSearch() {
		let t0 = performance.now();

		const p = getQueryParameters(),
			search = document.getElementById('q');

		if (search && p.q) search.value = p.q;
		else return;

		settings.getSearchSetting(true);
		searchStartsWith = !settings.wholeWord;

		let searchSettings = settings.getSettingValue();
		searchSettings = searchSettings ? '&amp;s=' + searchSettings : '';

		let query = p.q.trim().toLowerCase();
		let { results, termsInfo } = getSearchResults(normalize(query));

		results = distinct(results);
		results = sortResults(results);
		results = results.sort((a, b) => b.isPhrase > a.isPhrase ? 1 : b.isPhrase < a.isPhrase ? -1 : 0);

		function distinct(a) {
			const len = a.length, array = [];

			for (let i = 0; i < len; ++i) {
				let item = a[i], add = true;

				for (let j = 0; j < array.length; ++j) {
					if (array[j].url === item.url) {
						array[j].score += item.score;    // sum scores

						if (item.isPhrase) {
							array[j].isPhrase = true;
							array[j].lastIndex = item.lastIndex;

						} else if (array[j].lastIndex === -1) {
							array[j].lastIndex = item.lastIndex;
						}

						if (item.header) {
							if ( !array[j].header) array[j].header = [];

							array[j].header.push(item.header[0]);
						}
						add = false;
						break;
					}
				}
				if (add) array.push(item);
			}
			return array;
		}

		function getEntity(n) {
			let entity = '';
			switch (n) {
				case 0 : entity = '&#x2780;'; break;
				case 1 : entity = '&#x2781;'; break;
				case 2 : entity = '&#x2782;'; break;
				case 3 : entity = '&#x2783;'; break;
				case 4 : entity = '&#x2784;'; break;
				case 5 : entity = '&#x2785;'; break;
				default : break;
			}
			return entity ? '<b>' + entity + ' </b>' : '';
		}

		function sortResults(results) {
			const array = results.sort((a, b) => {
				if (b.score === a.score) {    // sort alphabetically by title if score is the same
					const x = a.title.toLowerCase(),
						y = b.title.toLowerCase();
					return (x < y) ? -1 : ((x > y) ? 1 : 0);

				} else {    // else by score descending
					return b.score - a.score;
				}
			});
			return array;
		}

		function addContent(info) {
			const content = getPageContent(info.index);
			if (content === null) return null;

			let start = info.lastIndex - 80,
				end = info.lastIndex + 50,
				len = content.length;

			if (start < 0) {
				start = 0;
				end = 130;

			} else {
				start = findWordBreak(start - 1, len, content);
			}

			end = findWordBreak(end - 1, len, content);
			if (end >= len) end = len - 1;

			function findWordBreak(i, len, content) {
				while (++i < len && /\w/.test(content[i]));
				return i;
			}
			return (start > 0 ? '...' : '') + content.substring(start, end).replace(/\u220E/g, ' ') + (len - end > 3 ? ' ...' : '');
		}

		if (results.length > 0) {
			if (debug) console.log('termsInfo =', termsInfo);

			query = encodeURI(query);
			const array = [], num = results.length;
			let info;

			array.push('<h4>Your search for <b class="query">', p.q, '</b> resulted in ', num, ' match' + (num === 1 ? "" : "es") + ':</h4><div class="results">');

			for (let i in results) {
				info = results[i];
				array.push('<div class="result"><a href="', info.url, '.html?q=', query, searchSettings, '" class="title">', info.title, '</a>');

				if (showSearchScore) array.push(' <span>', info.score, '</span>');

				if (info.score > 500000) array.push(' <span class="found-title">&#x2600;</span>');
				else if (info.score > 50000) array.push(' <span class="found-' + (info.isPhrase ? 'phrase' : 'word') + '">&#x2600;</span>');
				else if (info.score > 10000) array.push(' <span class="found-word">&#x2600;</span>');

				if (info.header && (info.header.length > 1 || info.header[0].text !== info.title)) {
					for (let k = 0; k < info.header.length; k++) {
						const header = info.header[k];
						if (header.text === info.title) continue;
						array.push('<br>', getEntity(header.level), '<a class="header" href="', info.url, '.html?q=', query, searchSettings, '#', header.id, '">', header.text, '</a>');
					}
					if (info.isPhrase && info.lastIndex !== -1) array.push('<p>', addContent(info), '</p>');

				} else {
					const content = addContent(info);
					if (content != null) array.push('<p>', content, '</p>');
				}
				array.push('<hr class="dvd"></div>');
			}
			array.push('</div>');
			$('.search-results').html(array.join(''));

		} else {
			const whole = settings.wholeWord,
				warning = whole ? 'with the option <b class="warning">Whole word</b> ' : '';
			let info = '', matches = '', zeroMatch = false, count = 0;

			if (Object.keys(termsInfo).length) {
				info += '<h4>Query statistics:</h4><ol class="stats">';

				for (const term in termsInfo) {
					const { score, searchType } = termsInfo[term];
					if (score === 0) {
						info += '<li><b>' + term + ' = ' + score + '</b></li>';
						zeroMatch = true;

					} else {
						info += '<li><a href="$search.html?q=' + term + '">' + term + '</a> = ' + score + ' - ' + searchType + '</li>';
						matches += term + ' ';
						count++;
					}
				}
				info += '</ol>';
				if (zeroMatch && count > 1) info += '<a href="$search.html?q=' + matches + '">' + matches + '</a>';
			}

			$('.search-results').html('<div>Your search for <b class="q">' + p.q + '</b> ' + warning + 'did not result in any matches.' + info + '</div>');
			$(".search-info").css('display', 'block');
		}

		console.log('search time = ' + (performance.now() - t0));
	}

	let settings = {
		storageName : 'Search-Bar-Options',
		maxNumber : 255,
		advancedSearchFlag : 1,
		localSearchFlag : 2,
		highlightAllFlag : 4,
		localHighlightAllFlag : 8,
		wholeWordFlag : 16,
		localWholeWordFlag : 32,

		advancedSearch : false,
		highlightAll : false,
		wholeWord : false,

		localSearch : false,
		localHighlightAll : true,
		localWholeWord : false,

		localSettingValue : 1,

		getSearchSetting : function(isSearchFile, local) {
			let value = !isSearchFile ? this.localSettingValue : this.getValue(this.storageName);
			if (isSearchFile) {
				if (local) {
					this.localSearch = (value & this.advancedSearchFlag) !== 0;
					this.localHighlightAll = (value & this.highlightAllFlag) !== 0;
					this.localWholeWord = (value & this.wholeWordFlag) !== 0;

				} else {
					this.advancedSearch = (value & this.advancedSearchFlag) !== 0;
					this.highlightAll = (value & this.highlightAllFlag) !== 0;
					this.wholeWord = (value & this.wholeWordFlag) !== 0;
				}

			} else {
				this.localSearch = (value & this.localSearchFlag) !== 0;
				this.localHighlightAll = (value & this.localHighlightAllFlag) !== 0;
				this.localWholeWord = (value & this.localWholeWordFlag) !== 0;
			}
		},

		toggleAdvancedSearch : function(isSearchFile) {
			return isSearchFile ? (this.advancedSearch = this.toggleFlag(this.advancedSearchFlag)) : (this.localSearch = this.toggleLocalFlag(this.localSearchFlag));
		},

		toggleHighlightAll : function(isSearchFile) {
			return isSearchFile ? (this.highlightAll = this.toggleFlag(this.highlightAllFlag)) : (this.localHighlightAll = this.toggleLocalFlag(this.localHighlightAllFlag));
		},

		toggleWholeWord : function(isSearchFile) {
			return isSearchFile ? (this.wholeWord = this.toggleFlag(this.wholeWordFlag)) : (this.localWholeWord = this.toggleLocalFlag(this.localWholeWordFlag));
		},

		setLocalFlag : function(flag, on) {
			this.localSettingValue = on ? ((this.localSettingValue ^ flag) | flag) : ((this.localSettingValue ^ flag) & (this.maxNumber ^ flag));
			return (this.localSettingValue & flag) !== 0;
		},

		toggleFlag : function(flag) {
			let value = this.getValue(this.storageName) ^ flag;
			this.saveValue(this.storageName, value);
			return (value & flag) !== 0;
		},

		toggleLocalFlag : function(flag) {
			this.localSettingValue = this.localSettingValue ^ flag;
			return (this.localSettingValue & flag) !== 0;
		},

		saveValue : function(name, val) {
			val = val & this.maxNumber;
			try {
				localStorage.setItem(name, val);
			} catch (e) {
				console.log(e);
			}
		},

		getValue : function(name) {
			try {
				let val = localStorage.getItem(name);
				return val ? val : this.localSearchFlag;
			} catch (e) { }

			try { this.saveValue(this.storageName, this.localSearchFlag); } catch (e) { }
			return this.localSearchFlag;
		},

		getSettingValue : function() {
			return this.getValue(this.storageName);
		}
	};
	
	$.fn.performSearch = function() {
		new performSearch();
	};

})(jQuery);























