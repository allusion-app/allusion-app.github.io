var windowsDownloadLink = document.getElementById('download-windows');
var macDownloadLink = document.getElementById('download-mac');
var linuxDownloadLink = document.getElementById('download-linux');

highlightOSButton();
setDownloadLinks();

// Highlight download button for user's platform
function highlightOSButton() {
    var ua = navigator.userAgent;
    if (ua.indexOf('Win') !== -1) {
        windowsDownloadLink.classList.add('strong');
    } else if (ua.indexOf('Mac') !== -1) {
        macDownloadLink.classList.add('strong');
    } else if (ua.indexOf('Linux') !== -1) {
        linuxDownloadLink.classList.add('strong');
    }
}

async function setDownloadLinks() {
    const response = await fetch('https://api.github.com/repos/allusion-app/Allusion/releases/latest', {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        },
    });
    const json = await response.json();
    const assets = json.assets;
    for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        if (asset.content_type.startsWith('application') && asset.name.startsWith('Allusion-')) {
            if (asset.name.endsWith('.exe')) {
                windowsDownloadLink.href = asset.browser_download_url;
                console.log(asset.browser_download_url)
            } else if (asset.name.endsWith('.dmg')) {
                macDownloadLink.href = asset.browser_download_url;
                console.log(asset.browser_download_url)
            } else if (asset.name.endsWith('.AppImage')) {
                linuxDownloadLink.href = asset.browser_download_url;
                console.log(asset.browser_download_url, linuxDownloadLink)
            }
        }
    }
}