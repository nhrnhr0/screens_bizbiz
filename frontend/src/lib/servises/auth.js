
import { browser } from "$app/environment";
import { LOGIN_URL, LOGOUT_URL, CURRENT_USER_URL } from "$lib/consts";
import { UserInfo } from '$lib/types.js';
import { goto } from '$app/navigation';
import { writable } from "svelte/store";
import { get } from 'svelte/store';
import { page } from "$app/stores";
// login: send post request to /api/login/
// {
//     "token": "83619f2f1ca6a609d4cd44ed7b8b42c7101751fb",
//         "me" (userInfo): {
//         "username": "nhrnhr0",
//             "business": "עסק 1",
//                 "status": "content_edit",
//                     "description": "",
//                         "is_superuser": true
//     }
// }

// Replace "./path/to/UserInfo" with the actual path to the module that defines the 'UserInfo' type.
/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ token: string, me: UserInfo }>}
 */
export async function login(username, password) {
    const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok)
    {
        setAuthToken(data.token);
        setMe(data.me)
        isAuthenticated.set(true);
        return data;
    } else
    {
        debugger;
        throw new Error(data.error);
    }
}
// logout: send post request to /api/logout/
// get-current-user: send get request to /api/current-user/
export async function logout() {
    if (browser)
    {
        try
        {
            await fetch(LOGOUT_URL, { method: 'POST', headers: addAuthHeader() });
        } catch (e)
        {
            console.error(e);
            alert('Error logging out');
        }
        window.localStorage.removeItem('auth_token');
        window.localStorage.removeItem('me');
        isAuthenticated.set(false);
        window.location.reload();
    }



}

// is-authenticated: is auth_token in cookies
export let isAuthenticated = writable(browser ? !!getAuthToken() : false);
export let me = writable(browser ? getMe() : null);


// getAuthToken: get auth_token from cookies
export function getAuthToken() {
    if (browser)
    {
        return window.localStorage.getItem('auth_token');
    } else
    {
        return null;

    }
}
export function setAuthToken(token) {
    if (browser)
    {
        window.localStorage.setItem('auth_token', token);
    } else
    {
        return null;
    }
}

/**
 * @returns {UserInfo | null}
 */
export function getMe() {
    if (!browser) return null;
    let val = window.localStorage.getItem('me');
    if (!val) return null;
    return JSON.parse(val);
}

/**
 * @param {object} new_me
 */
export function setMe(new_me) {
    if (!browser) return;
    window.localStorage.setItem('me', JSON.stringify(new_me));
    me.set(new_me);

}


export function protectedRoute() {
    if (!get(isAuthenticated) && browser)
    {

        goto('/login?next=' + encodeURIComponent(get(page).url.pathname));
    }
}


/**
 * @param {object|undefined} headers
 * @returns {object}
 */
export function addAuthHeader(headers) {
    if (headers === undefined)
    {
        headers = {};
    }
    const token = getAuthToken();
    if (token)
    {
        headers['Authorization'] = `token ${token}`;
    }
    return headers;
}