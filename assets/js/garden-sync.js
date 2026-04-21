/* Community garden: optional cloud sync via PUT /api/profile/me { community_garden: {...} }.
 * Falls back to localStorage only if the API omits the field or rejects the request. */

var GardenSync = (function () {
  "use strict";

  function apiBase() {
    if (typeof window !== "undefined" && window.API) {
      return String(window.API).replace(/\/$/, "");
    }
    if (typeof window.PWC_API_BASE_URL !== "undefined" && window.PWC_API_BASE_URL) {
      return String(window.PWC_API_BASE_URL).replace(/\/$/, "");
    }
    return "";
  }

  function fetchMe() {
    var b = apiBase();
    if (!b) return Promise.resolve(null);
    return fetch(b + "/api/auth/me", { credentials: "include" }).then(function (r) {
      return r.ok ? r.json() : null;
    });
  }

  /**
   * @returns {Promise<object|null>} server state or null
   */
  function loadServerState() {
    return fetchMe().then(function (u) {
      if (!u || !u.community_garden) return null;
      return u.community_garden;
    });
  }

  var saveTimer = null;

  function putState(state) {
    var b = apiBase();
    if (!b) return Promise.reject(new Error("no api"));
    return fetch(b + "/api/profile/me", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ community_garden: state }),
    }).then(function (r) {
      if (!r.ok) return Promise.reject(new Error("save failed"));
      return r.json();
    });
  }

  function debouncedSave(state) {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveTimer = null;
      putState(state).catch(function () {});
    }, 1400);
  }

  return {
    apiBase:       apiBase,
    loadServerState: loadServerState,
    debouncedSave: debouncedSave,
    saveNow:       putState,
  };
})();
