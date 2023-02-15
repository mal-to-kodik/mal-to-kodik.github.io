document.addEventListener('DOMContentLoaded', async function () {
	const queryParams = new URLSearchParams(window.location.search);
	const malId = queryParams.get('mal-id');
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
					render(body, buildIframe(iframeSrc));
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
		render(body, errorMessage('mal-id query param was not found'));
	}
});

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