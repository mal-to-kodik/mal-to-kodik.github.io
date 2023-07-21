const IFRAME_URL_PREFIX = 'https://kodik.info/';

document.addEventListener('DOMContentLoaded', async function () {
	const iframeSrc = await getIframeSrc();
	if (iframeSrc) {
		const iframe = buildIframe(iframeSrc);
		render(iframe);
	}
});

async function getIframeSrc() {
	let result;
	const queryParams = new URLSearchParams(window.location.search);
	const anime = queryParams.get('anime');
	let iframeSrc = queryParams.get('iframe-src');
	if (!iframeSrc && anime) {
		document.querySelector('title').textContent = anime;
		const translation = queryParams.get('translation');
		iframeSrc = await getIframeSrcForAnime(anime, translation);
	}
	if (iframeSrc) {
		const episode = queryParams.get('episode');
		const season = queryParams.get('season');
		result = buildIframeUrl(iframeSrc, episode, season);
	}
	return result;
}

async function getIframeSrcForAnime(anime, translation) {
	let result;
	try {
		const playerResponse = await getPlayer(anime, translation);
		if (playerResponse.ok) {
			const playerDto = await playerResponse.json();
			let iframeSrc = playerDto.link;
			if (playerDto.found && iframeSrc) {
				result = iframeSrc;
			} else {
				renderError('Kodik player was not found for ' + anime);
			}
		} else {
			renderError('Failed to get Kodik player for ' + anime);
		}
	} catch (e) {
		renderError('Failed to get Kodik player for ' + anime);
	}
	return result;
}

async function getPlayer(anime, translation) {
	const result = new URL('https://kodikapi.com/get-player');
	const queryParams = new URLSearchParams();
	queryParams.set('token', '447d179e875efe44217f20d1ee2146be');
	queryParams.set('shikimoriID', anime);
	if (isValidNumber(translation)) {
		queryParams.set('prioritizeTranslations', translation);
	}
	result.search = queryParams.toString();
	return await fetch(result);
}

function isValidNumber(value) {
	return value && (value === '0' || Number.parseInt(value));
}

function buildIframe(src) {
	const result = document.createElement('iframe');
	result.setAttribute('src', src);
	result.setAttribute('width', '100%');
	result.setAttribute('height', '100%');
	result.setAttribute('allowfullscreen', '');
	result.setAttribute('frameborder', '0');
	return result;
}

function buildIframeUrl(iframeSrc, episode, season) {
	let url;
	if (iframeSrc.startsWith('//')) {
		url = 'https:' + iframeSrc;
	} else {
		url = IFRAME_URL_PREFIX + iframeSrc;
	}
	const result = new URL(url);
	const queryParams = new URLSearchParams();
	if (isValidNumber(episode)) {
		queryParams.set('episode', episode);
	}
	if (isValidNumber(season)) {
		queryParams.set('season', season);
	}
	result.search = queryParams.toString();
	return result.toString();
}

function render(child) {
	document.querySelector('body').innerHTML = '';
	document.querySelector('body').appendChild(child);
}

function renderError(message) {
	render(errorMessage(message));
}

function errorMessage(errorMessage) {
	const result = document.createElement('h1');
	result.textContent = errorMessage;
	return result;
}