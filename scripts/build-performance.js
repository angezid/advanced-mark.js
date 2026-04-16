
const fs = require('fs');
const { minify } = require('terser');

const sourceDir = 'performance/src',
	destDir = 'performance/build';

const debug = false;

process();

async function process() {
	let scripts = '',
		success = true;

	try {
		let main = fs.readFileSync(sourceDir + '/js/main.js', 'utf-8');
		let mark = fs.readFileSync('dist/mark.js', 'utf-8');

		if (debug) {
			scripts += mark + '\n\n' + main;

		} else {
			let result = await minify(mark);
			scripts += result.code + '\n\n';
			result = await minify(main);
			scripts += result.code + '\n\n';
		}

		let jsPath = destDir + '/js';

		if ( !fs.existsSync(jsPath)) {
			fs.mkdirSync(jsPath, { recursive: true });
		}

		fs.writeFileSync(jsPath + '/bundle.js', scripts);

		let html = fs.readFileSync(sourceDir + '/performance.html', 'utf-8');
		html = html.replace(/<script\s[^]+<\/script>/, '<script src="js/bundle.js"><\/script>');

		fs.writeFileSync(destDir + '/index.html', html);

	} catch(e) {
		console.log(e);
		success = false;
	}

	if (success) {
		console.log('The performance page was build successfully.');
	}
}
