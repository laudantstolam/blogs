// Flexoki syntax themes for Expressive Code (Shiki doesn't bundle Flexoki,
// so this hand-maps the published palette: https://github.com/kepano/flexoki).
// Structural colors (background/border/padding/radius) are NOT set here —
// they're bound to the site's own CSS variables via `styleOverrides` in
// astro.config.mjs, so codeblocks stay in sync with light/dark toggling.
// ponytail: token scopes cover the common cases (comments, strings, numbers,
// keywords, functions, tags/attrs, punctuation) — add more scopes if a
// language you use renders with the wrong color.

const base = {
	paper: '#FFFCF0', base50: '#F2F0E5', base100: '#E6E4D9', base150: '#DAD8CE',
	base200: '#CECDC3', base300: '#B7B5AC', base400: '#9F9D96', base500: '#878580',
	base600: '#6F6E69', base700: '#575653', base800: '#403E3C', base850: '#343331',
	base900: '#282726', base950: '#1C1B1A', black: '#100F0F',
};

const accent600 = { red: '#AF3029', orange: '#BC5215', yellow: '#AD8301', green: '#66800B', cyan: '#24837B', blue: '#205EA6', purple: '#5E409D', magenta: '#A02F6F' };
const accent400 = { red: '#D14D41', orange: '#DA702C', yellow: '#D0A215', green: '#879A39', cyan: '#3AA99F', blue: '#4385BE', purple: '#8B7EC8', magenta: '#CE5D97' };

function tokenColors(a, fg, muted) {
	return [
		{ scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: muted, fontStyle: 'italic' } },
		{ scope: ['string', 'string.quoted'], settings: { foreground: a.green } },
		{ scope: ['constant.numeric', 'constant.language', 'constant.character', 'variable.language'], settings: { foreground: a.purple } },
		{ scope: ['keyword', 'keyword.control', 'storage.type', 'storage.modifier'], settings: { foreground: a.red } },
		{ scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: a.blue } },
		{ scope: ['entity.name.type', 'entity.name.class', 'support.class', 'support.type'], settings: { foreground: a.yellow } },
		{ scope: ['entity.name.tag'], settings: { foreground: a.red } },
		{ scope: ['entity.other.attribute-name'], settings: { foreground: a.orange } },
		{ scope: ['variable', 'variable.other'], settings: { foreground: fg } },
		{ scope: ['punctuation', 'punctuation.separator', 'punctuation.terminator', 'meta.brace'], settings: { foreground: muted } },
	];
}

export const flexokiLight = {
	name: 'flexoki-light',
	type: 'light',
	colors: {
		'editor.background': base.paper,
		'editor.foreground': base.base900,
	},
	tokenColors: tokenColors(accent600, base.base900, base.base600),
};

export const flexokiDark = {
	name: 'flexoki-dark',
	type: 'dark',
	colors: {
		'editor.background': base.black,
		'editor.foreground': base.base200,
	},
	tokenColors: tokenColors(accent400, base.base200, base.base500),
};
