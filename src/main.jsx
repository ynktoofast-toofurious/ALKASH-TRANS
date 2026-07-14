import React from 'react';
import ReactDOM from 'react-dom/client';
import { renderPageApp } from './site';
import { getBaseHref, getMaskedHref, getPublicHomeHref, pageByRouteToken } from './routes';
import './styles.css';

const { pathname } = window.location;
const isDirectHtmlPath = pathname.endsWith('.html') && pathname !== '/index.html';
const baseHref = new URL(getBaseHref(), window.location.origin).pathname;
const normalizedBasePath = baseHref.endsWith('/') ? baseHref.slice(0, -1) || '/' : baseHref;
const isAlkashPath = pathname.startsWith(normalizedBasePath);
const accessKey = localStorage.getItem('mwangaza_access_code_unlocked');
const normalizeCode = (code) => (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const accessCode = normalizeCode(localStorage.getItem('mwangaza_access_code_value'));
const allowedCodes = ['YNKALK2026', 'YNK19912026'];
const hasValidPortalAccess = accessKey === 'true' && allowedCodes.includes(accessCode);

if (!import.meta.env.DEV && isAlkashPath && !isDirectHtmlPath && !hasValidPortalAccess) {
    window.location.replace(getPublicHomeHref());
}

if (isDirectHtmlPath) {
    window.location.replace(getPublicHomeHref());
}

const routeToken = new URLSearchParams(window.location.search).get('k');
const tokenPage = routeToken ? pageByRouteToken[routeToken] : null;
const page = tokenPage || document.body.dataset.page || 'home';
const isCanonicalPath = pathname === normalizedBasePath || pathname === `${normalizedBasePath}/index.html`;

if (!isDirectHtmlPath && !isCanonicalPath) {
    const canonicalHref = getMaskedHref(page);
    const currentHref = `${window.location.pathname}${window.location.search}`;

    if (canonicalHref !== currentHref) {
        window.location.replace(canonicalHref);
    }
}

if (!isDirectHtmlPath && pathname === `${normalizedBasePath}/index.html`) {
    const canonicalHref = getMaskedHref(page);
    const currentHref = `${window.location.pathname}${window.location.search}`;

    if (canonicalHref !== currentHref) {
        window.location.replace(canonicalHref);
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {renderPageApp(page)}
    </React.StrictMode>
);