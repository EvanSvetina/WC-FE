/* ==========================================================================
   GroupRenderer — all groups DOM rendering.
   Single responsibility: turn data into HTML and update the page.
   Never makes HTTP requests; never manages application state.
   ========================================================================== */

var GroupRenderer = (function () {
  "use strict";

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function formatDate(iso) {
    var d = new Date(iso);
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function viewerApplicationStatus(group, groupId, isMember, pendingIds, deniedIds, currentUser) {
    if (!currentUser || isMember) return null;
    if (group.my_application_status === "pending" || group.my_application_status === "denied") {
      return group.my_application_status;
    }
    if (pendingIds.indexOf(groupId) !== -1) return "pending";
    if (deniedIds.indexOf(groupId) !== -1) return "denied";
    return null;
  }

  /* ── Group list ─────────────────────────────────────────────────────── */

  function renderGroups(groups, myGroupIds, pendingIds, deniedIds, currentUser) {
    var container = document.getElementById("groups-list");
    if (!groups || groups.length === 0) {
      container.innerHTML = '<div class="pwc-groups-empty">No groups yet. Be the first to create one!</div>';
      return;
    }

    var html = "";
    groups.forEach(function (g) {
      var isMember = myGroupIds.indexOf(g.id) !== -1;
      var isOwner  = currentUser && currentUser.id === g.created_by;
      var isAdmin  = currentUser && currentUser.role === "admin";
      var reqApp   = !!g.requires_application;
      var appStat  = viewerApplicationStatus(g, g.id, isMember, pendingIds, deniedIds, currentUser);

      var memberBadge = isMember
        ? '<span class="pwc-groups-badge pwc-groups-badge--member">Member</span>'
        : "";

      var applyBadge = "";
      if (reqApp && !isMember && currentUser) {
        applyBadge = '<span class="pwc-groups-badge pwc-groups-badge--apply">Application required</span>';
      }

      var actionBtn = "";
      if (currentUser) {
        if (isMember) {
          actionBtn = '<button class="pwc-btn pwc-btn-muted pwc-btn-sm" onclick="event.stopPropagation(); Groups.leaveGroup(' + g.id + ')">Leave</button>';
        } else if (reqApp) {
          if (appStat === "pending") {
            actionBtn = '<span class="pwc-groups-pending-label">Application pending</span>';
          } else {
            var applyLabel = appStat === "denied" ? "Apply again" : "Apply";
            actionBtn = '<button class="pwc-btn pwc-btn-sage pwc-btn-sm" onclick="event.stopPropagation(); Groups.applyToGroup(' + g.id + ')">' + applyLabel + "</button>";
          }
        } else {
          actionBtn = '<button class="pwc-btn pwc-btn-sage pwc-btn-sm" onclick="event.stopPropagation(); Groups.joinGroup(' + g.id + ')">Join</button>';
        }
      }

      var adminBtns = "";
      if (isOwner || isAdmin) {
        adminBtns += '<button class="pwc-blog-admin-btn" onclick="event.stopPropagation(); Groups.showEdit(' + g.id + ')" title="Edit">Edit</button>';
        adminBtns += '<button class="pwc-blog-admin-btn pwc-blog-admin-btn--danger" onclick="event.stopPropagation(); Groups.deleteGroup(' + g.id + ')" title="Delete">Delete</button>';
      }

      var badges = '<div class="pwc-groups-card-badges">' + memberBadge + applyBadge + "</div>";

      html += '<article class="pwc-groups-card' + (isMember ? " pwc-groups-card--member" : "") + '" onclick="Groups.openGroup(' + g.id + ')">'
        + '<div class="pwc-groups-card-top">'
        +   badges
        +   '<div class="pwc-blog-card-admin">' + adminBtns + "</div>"
        + "</div>"
        + '<h2 class="pwc-groups-card-title">' + escapeHtml(g.name) + "</h2>"
        + '<p class="pwc-groups-card-desc">'   + escapeHtml(g.description || "No description.") + "</p>"
        + '<div class="pwc-groups-card-meta">'
        +   '<span class="pwc-groups-card-members">' + g.member_count + " member" + (g.member_count !== 1 ? "s" : "") + "</span>"
        +   '<span class="pwc-blog-card-date">' + formatDate(g.created_at) + "</span>"
        +   actionBtn
        + "</div>"
        + "</article>";
    });

    container.innerHTML = html;
  }

  /* ── Group detail ───────────────────────────────────────────────────── */

  function renderGroupDetail(group, myGroupIds, pendingIds, deniedIds, currentUser) {
    var content = document.getElementById("groups-detail-content");
    var isMember = myGroupIds.indexOf(group.id) !== -1;
    var reqApp   = !!group.requires_application;
    var isOwner  = currentUser && currentUser.id === group.created_by;
    var isAdmin  = currentUser && currentUser.role === "admin";
    var isMod    = isOwner || isAdmin;
    var appStat  = viewerApplicationStatus(group, group.id, isMember, pendingIds, deniedIds, currentUser);

    var html = '<article class="pwc-groups-detail">'
      + "<h1>" + escapeHtml(group.name) + "</h1>"
      + '<p class="pwc-groups-detail-desc">' + escapeHtml(group.description || "No description.") + "</p>"
      + '<div class="pwc-groups-detail-meta">'
      +   "<span>" + group.member_count + " member" + (group.member_count !== 1 ? "s" : "") + "</span>"
      +   "<span>Created " + formatDate(group.created_at) + "</span>"
      + "</div>";

    if (reqApp) {
      html += '<p class="pwc-groups-detail-policy">New members must apply and be approved by the group owner (or a site admin).</p>';
    }

    if (currentUser) {
      if (isMember) {
        html += '<button class="pwc-btn pwc-btn-muted" onclick="Groups.leaveGroup(' + group.id + ')">Leave Group</button>';
      } else if (reqApp) {
        if (appStat === "pending") {
          html += '<p class="pwc-groups-apply-status pwc-groups-apply-status--pending">Your application is pending. You will be notified when it is reviewed.</p>';
        } else {
          if (appStat === "denied") {
            html += '<p class="pwc-groups-apply-status pwc-groups-apply-status--denied">Your previous application was not approved. You may submit a new one below.</p>';
          }
          html += '<div class="pwc-groups-apply-box">'
            + '<label for="groups-apply-message">Message to organizers (optional)</label>'
            + '<textarea id="groups-apply-message" rows="3" placeholder="Introduce yourself or explain why you would like to join..."></textarea>'
            + '<button type="button" class="pwc-btn pwc-btn-sage" onclick="Groups.applyToGroup(' + group.id + ')">Submit application</button>'
            + "</div>";
        }
      } else {
        html += '<button class="pwc-btn pwc-btn-sage" onclick="Groups.joinGroup(' + group.id + ')">Join Group</button>';
      }
    }

    html += "</article>";

    if (isMod && group.pending_applications && group.pending_applications.length > 0) {
      html += '<section class="pwc-groups-applications">'
        + "<h3>Pending applications</h3>"
        + '<p class="pwc-groups-applications-hint">Accept adds the member; deny lets them apply again later.</p>';
      group.pending_applications.forEach(function (a) {
        html += '<div class="pwc-groups-application-card">'
          + '<div class="pwc-groups-application-user">'
          +   escapeHtml(a.name)
          +   ' <span class="pwc-groups-application-username">@' + escapeHtml(a.username) + "</span>"
          +   '<span class="pwc-groups-application-date">' + formatDate(a.created_at) + "</span>"
          + "</div>";
        if (a.message) {
          html += '<blockquote class="pwc-groups-application-msg">' + escapeHtml(a.message) + "</blockquote>";
        }
        html += '<div class="pwc-groups-application-actions">'
          + '<button type="button" class="pwc-btn pwc-btn-sage pwc-btn-sm" onclick="Groups.decideApplication(' + group.id + "," + a.id + ',true)">Accept</button>'
          + '<button type="button" class="pwc-btn pwc-btn-muted pwc-btn-sm" onclick="Groups.decideApplication(' + group.id + "," + a.id + ',false)">Deny</button>'
          + "</div>"
          + "</div>";
      });
      html += "</section>";
    }

    html += '<section class="pwc-groups-members">'
      + "<h3>Members</h3>";

    if (group.members && group.members.length > 0) {
      group.members.forEach(function (m) {
        var name = ((m.firstName || "") + " " + (m.lastName || "")).trim() || m.username;
        html += '<div class="pwc-groups-member">'
          + '<div class="pwc-groups-member-avatar">' + escapeHtml((m.firstName || "?").charAt(0) + (m.lastName || "").charAt(0)) + "</div>"
          + '<div class="pwc-groups-member-info">'
          +   '<span class="pwc-groups-member-name">' + escapeHtml(name) + "</span>"
          +   '<span class="pwc-groups-member-username">@' + escapeHtml(m.username) + "</span>"
          + "</div>"
          + "</div>";
      });
    } else {
      html += '<p class="pwc-groups-no-members">No members yet.</p>';
    }

    html += "</section>";
    content.innerHTML = html;
  }

  /* ── Loading / error states ────────────────────────────────────────── */

  function showLoading() {
    document.getElementById("groups-list").innerHTML = '<div class="pwc-blog-loading">Loading groups...</div>';
  }

  function showError(message) {
    document.getElementById("groups-list").innerHTML = '<div class="pwc-blog-empty">' + escapeHtml(message) + "</div>";
  }

  function showDetailLoading() {
    document.getElementById("groups-detail-content").innerHTML = '<div class="pwc-blog-loading">Loading...</div>';
  }

  function setCreateButton(visible) {
    var btn = document.getElementById("groups-new-btn");
    if (btn) btn.style.display = visible ? "" : "none";
  }

  return {
    renderGroups:       renderGroups,
    renderGroupDetail:  renderGroupDetail,
    showLoading:        showLoading,
    showError:          showError,
    showDetailLoading:  showDetailLoading,
    setCreateButton:    setCreateButton,
  };

})();
