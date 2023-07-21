document.addEventListener('DOMContentLoaded', async function () {
	const queryParams = new URLSearchParams(window.location.search);
	const malId = queryParams.get('mal-id');
	const episode = queryParams.get('episode');
	const season = queryParams.get('season');
	const body = document.querySelector('body');
	if (malId) {
		try {
			const response = await fetch(
					'https://kodikapi.com/get-player?token=447d179e875efe44217f20d1ee2146be&shikimoriID=' + malId);
			if (response.ok) {
				const dto = await response.json();
				let iframeSrc = dto.link;
				if (dto.found && iframeSrc) {
					if (iframeSrc.startsWith('//')) {
						iframeSrc = 'https:' + iframeSrc;
					}
					const iframeUrl = new URL(iframeSrc);
					const iframeQueryParams = new URLSearchParams();
					if (isValidNumber(episode)) {
						iframeQueryParams.set('episode', episode);
					}
					if (isValidNumber(season)) {
						iframeQueryParams.set('season', season);
					}
					iframeUrl.search = iframeQueryParams.toString();
					render(body, buildIframe(iframeUrl.toString()));
					document.querySelector('title').textContent = malId;
				} else {
					render(body, errorMessage('Kodik player was not found for ' + malId));
				}
			} else {
				render(body, errorMessage('Error during getting Kodik player for ' + malId));
			}
		} catch (e) {
			render(body, errorMessage('Error during getting Kodik player for ' + malId));
		}
	} else {
		render(body, errorMessage('URL must look like this https://mal-to-kodik.github.io/?mal-id=1'));
	}
});

function isValidNumber(value) {
	return value && (value === '0' || Number.parseInt(value));
}

function buildIframe(iframeSrc) {
	const result = document.createElement('iframe');
	result.setAttribute('src', iframeSrc);
	result.setAttribute('width', '100%');
	result.setAttribute('height', '100%');
	result.setAttribute('allowfullscreen', '');
	result.setAttribute('frameborder', '0');
	return result;
}

function errorMessage(errorMessage) {
	const result = document.createElement('h1');
	result.textContent = errorMessage;
	return result;
}

function render(body, child) {
	body.innerHTML = '';
	body.appendChild(child);
}