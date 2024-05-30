import isWebview from 'is-ua-webview';
import { signIn } from 'next-auth/react';

export async function signInToMyApp(providerId) {
    if (isWebview(window.navigator.userAgent)) {
      alert("Open in Safari or Chrome to sign in");
      return;
    }
    await signIn(providerId);
}
