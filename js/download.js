"use strict";

(async function setupDownloadLinks() {
    const windowsDownloadLink = document.getElementById('download-windows');
    const macDownloadLink = document.getElementById('download-mac');
    const linuxDownloadLink = document.getElementById('download-linux');

    // Highlight download button for user's platform
    const LINK_CLASS = "download__link__strong";
    const ua = navigator.userAgent;

    if (ua.indexOf("Win") !== -1) {
        windowsDownloadLink.className = LINK_CLASS;
    } else if (ua.indexOf("Mac") !== -1) {
        macDownloadLink.className = LINK_CLASS;
    } else if (ua.indexOf("Linux") !== -1) {
        linuxDownloadLink.className = LINK_CLASS;
    }

    // Set actual link targets to executables
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
            } else if (asset.name.endsWith('.dmg')) {
                macDownloadLink.href = asset.browser_download_url;
            } else if (asset.name.endsWith('.AppImage')) {
                linuxDownloadLink.href = asset.browser_download_url;
            }
        }
    }
})();
