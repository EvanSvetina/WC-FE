/* ==========================================================================
   Groups — coordinator: manages state, binds events, and delegates to
   GroupAPI (HTTP) and GroupRenderer (DOM).
   ========================================================================== */

var Groups = (function () {
  "use strict";

  /* ── State ───────────────────────────────────────────────────────────── */

  var currentUser = null;
  var myGroupIds  = [];

  /* ── Init ────────────────────────────────────────────────────────────── */

  function init() {
    var stored = sessionStorage.getItem("pwc_user");
    if (stored) {
      try { currentUser = JSON.parse(stored); } catch (_) { currentUser = null; }
    }

    GroupAPI.getMyGroups()
      .then(function (groups) {
        myGroupIds = groups.map(function (g) { return g.id; });
      })
      .catch(function () { myGroupIds = []; })
      .finally(function () {
        GroupRenderer.setCreateButton(!!currentUser);
        loadGroups();
      });
  }

  /* ── Load groups ─────────────────────────────────────────────────────── */

  function loadGroups() {
    GroupRenderer.showLoading();

    GroupAPI.getGroups()
      .then(function (groups) {
        GroupRenderer.renderGroups(groups, myGroupIds, currentUser);
      })
      .catch(function () {
        GroupRenderer.showError("Could not load groups. Is the backend running?");
      });
  }

  /* ── Single group detail ─────────────────────────────────────────────── */

  function openGroup(id) {
    var overlay = document.getElementById("groups-detail-overlay");
    GroupRenderer.showDetailLoading();
    overlay.style.display       = "flex";
    document.body.style.overflow = "hidden";

    GroupAPI.getGroup(id)
      .then(function (group) { GroupRenderer.renderGroupDetail(group, myGroupIds, currentUser); })
      .catch(function ()     {
        document.getElementById("groups-detail-content").innerHTML = '<div class="pwc-blog-empty">Could not load group.</div>';
      });
  }

  function hideDetail() {
    document.getElementById("groups-detail-overlay").style.display = "none";
    document.body.style.overflow = "";
  }

  /* ── Join / Leave ────────────────────────────────────────────────────── */

  function joinGroup(id) {
    GroupAPI.joinGroup(id)
      .then(function () {
        if (myGroupIds.indexOf(id) === -1) myGroupIds.push(id);
        loadGroups();
        refreshDetailIfOpen(id);
      })
      .catch(function (err) { alert(err.message); });
  }

  function leaveGroup(id) {
    if (!confirm("Leave this group?")) return;
    GroupAPI.leaveGroup(id)
      .then(function () {
        var idx = myGroupIds.indexOf(id);
        if (idx !== -1) myGroupIds.splice(idx, 1);
        loadGroups();
        refreshDetailIfOpen(id);
      })
      .catch(function (err) { alert(err.message); });
  }

  function refreshDetailIfOpen(id) {
    var overlay = document.getElementById("groups-detail-overlay");
    if (overlay && overlay.style.display !== "none") {
      GroupAPI.getGroup(id)
        .then(function (group) { GroupRenderer.renderGroupDetail(group, myGroupIds, currentUser); })
        .catch(function () {});
    }
  }

  /* ── Create / Edit ───────────────────────────────────────────────────── */

  function showCreate() {
    document.getElementById("groups-compose-title").textContent = "New Group";
    document.getElementById("groups-edit-id").value             = "";
    document.getElementById("groups-name").value                = "";
    document.getElementById("groups-desc").value                = "";
    document.getElementById("groups-submit-btn").textContent    = "Create Group";
    document.getElementById("groups-compose-overlay").style.display = "flex";
    document.body.style.overflow = "hidden";
    document.getElementById("groups-name").focus();
  }

  function showEdit(groupId) {
    GroupAPI.getGroup(groupId).then(function (group) {
      document.getElementById("groups-compose-title").textContent = "Edit Group";
      document.getElementById("groups-edit-id").value             = group.id;
      document.getElementById("groups-name").value                = group.name;
      document.getElementById("groups-desc").value                = group.description;
      document.getElementById("groups-submit-btn").textContent    = "Save Changes";
      document.getElementById("groups-compose-overlay").style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  }

  function hideCompose() {
    document.getElementById("groups-compose-overlay").style.display = "none";
    document.body.style.overflow = "";
  }

  function submitGroup(e) {
    e.preventDefault();
    var editId = document.getElementById("groups-edit-id").value;
    var name   = document.getElementById("groups-name").value.trim();
    var desc   = document.getElementById("groups-desc").value.trim();
    if (!name) return;

    var btn = document.getElementById("groups-submit-btn");
    btn.disabled    = true;
    btn.textContent = "Saving...";

    var apiCall = editId
      ? GroupAPI.updateGroup(editId, name, desc)
      : GroupAPI.createGroup(name, desc);

    apiCall
      .then(function (result) {
        if (!editId && result && result.id && myGroupIds.indexOf(result.id) === -1) {
          myGroupIds.push(result.id);
        }
        hideCompose();
        loadGroups();
      })
      .catch(function (err) { alert(err.message); })
      .finally(function () {
        btn.disabled    = false;
        btn.textContent = editId ? "Save Changes" : "Create Group";
      });
  }

  /* ── Delete ──────────────────────────────────────────────────────────── */

  function deleteGroup(groupId) {
    if (!confirm("Delete this group? All members will be removed.")) return;
    GroupAPI.deleteGroup(groupId)
      .then(function () {
        var idx = myGroupIds.indexOf(groupId);
        if (idx !== -1) myGroupIds.splice(idx, 1);
        var detail = document.getElementById("groups-detail-overlay");
        if (detail.style.display !== "none") hideDetail();
        loadGroups();
      })
      .catch(function (err) { alert(err.message); });
  }

  /* ── Boot ────────────────────────────────────────────────────────────── */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Public API */
  return {
    openGroup:   openGroup,
    hideDetail:  hideDetail,
    joinGroup:   joinGroup,
    leaveGroup:  leaveGroup,
    showCreate:  showCreate,
    showEdit:    showEdit,
    hideCompose: hideCompose,
    submitGroup: submitGroup,
    deleteGroup: deleteGroup,
  };

})();
