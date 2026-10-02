/* Meal POPs admin sign in. Uses Supabase Auth. */
(function () {
  var LOGIN = '/AdminLogin.html', DASH = '/AdminDashboard.html', SETPW = '/AdminSetPassword.html';
  var cfg = window.MEALPOPS_SUPABASE || {};
  var configured = !!(cfg.url && cfg.anonKey && cfg.url.indexOf('YOUR-PROJECT') === -1 && cfg.anonKey.indexOf('YOUR-ANON-KEY') === -1);
  var page = document.body.getAttribute('data-admin-page');

  function $(id) { return document.getElementById(id); }
  function reveal() { document.documentElement.style.visibility = 'visible'; }
  function msg(text, kind) {
    var m = $('mp-msg'); if (!m) return;
    var c = { error: ['#FDE3D6', '#8A1F0E'], ok: ['#DDEBD9', '#1D4A2A'], info: ['#FCEBC0', '#3E392F'] }[kind || 'info'];
    m.textContent = text || ''; m.style.display = text ? 'block' : 'none'; m.style.background = c[0]; m.style.color = c[1];
  }
  function busy(btn, on, label) {
    if (!btn) return;
    if (on) { btn.dataset.label = btn.textContent; btn.textContent = label; btn.disabled = true; btn.style.opacity = '0.7'; btn.style.cursor = 'wait'; }
    else { btn.textContent = btn.dataset.label || btn.textContent; btn.disabled = false; btn.style.opacity = ''; btn.style.cursor = ''; }
  }
  function safeNext() {
    var n = new URLSearchParams(location.search).get('next');
    return (n && n.charAt(0) === '/' && n.charAt(1) !== '/') ? n : DASH;
  }
  function friendly(err) {
    var t = ((err && err.message) || '').toLowerCase();
    if (t.indexOf('invalid login') > -1) return "That email and password don't match an admin account.";
    if (t.indexOf('email not confirmed') > -1) return 'Please accept your invite email first, then set your password.';
    if (t.indexOf('rate') > -1 || t.indexOf('too many') > -1) return 'Too many attempts. Please wait a minute and try again.';
    if (t.indexOf('fetch') > -1 || t.indexOf('network') > -1) return "We couldn't reach the sign in service. Check your connection and try again.";
    if (t.indexOf('should be different') > -1) return 'Your new password must be different from your old one.';
    if (t.indexOf('password') > -1 && t.indexOf('least') > -1) return 'That password is too short.';
    return 'Something went wrong. Please try again.';
  }

  if (!configured) {
    if (page === 'dashboard') { location.replace(LOGIN); return; }
    msg('Admin sign in is not connected yet. Add your Supabase project details to assets/admin-config.js.', 'info');
    reveal(); return;
  }

  var sb = window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

  /* SIGN IN PAGE */
  if (page === 'login') {
    var email = $('mp-email'), pw = $('mp-password'), btn = $('mp-signin'), forgot = $('mp-forgot');
    sb.auth.getSession().then(function (r) { if (r.data && r.data.session) location.replace(safeNext()); });
    function signIn() {
      var e = (email.value || '').trim(), p = pw.value || '';
      if (!e || !p) { msg('Enter your email and password.', 'error'); (e ? pw : email).focus(); return; }
      msg(''); busy(btn, true, 'Signing in…');
      sb.auth.signInWithPassword({ email: e, password: p }).then(function (r) {
        if (r.error) { busy(btn, false); msg(friendly(r.error), 'error'); pw.select(); return; }
        btn.textContent = 'Signed in'; location.replace(safeNext());
      }).catch(function (err) { busy(btn, false); msg(friendly(err), 'error'); });
    }
    btn.addEventListener('click', signIn);
    [email, pw].forEach(function (el) { el.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); signIn(); } }); });
    forgot.addEventListener('click', function (ev) {
      ev.preventDefault();
      var e = (email.value || '').trim();
      if (!e) { msg('Type your email above, then choose Forgot password again.', 'info'); email.focus(); return; }
      msg('Sending a reset link…', 'info');
      sb.auth.resetPasswordForEmail(e, { redirectTo: location.origin + SETPW }).then(function (r) {
        if (r.error && /rate|too many/i.test(r.error.message || '')) { msg(friendly(r.error), 'error'); return; }
        msg('If that email belongs to an admin, a reset link is on its way. Check your inbox.', 'ok');
      }).catch(function (err) { msg(friendly(err), 'error'); });
    });
    return;
  }

  /* SET PASSWORD PAGE (invites and resets) */
  if (page === 'setpassword') {
    var np = $('mp-new'), cp = $('mp-confirm'), save = $('mp-save');
    var hash = new URLSearchParams((location.hash || '').replace(/^#/, ''));
    function expired() {
      $('mp-title').textContent = 'This link has expired';
      $('mp-sub').innerHTML = 'Invite and reset links only work once and for a limited time. <a href="' + LOGIN + '" style="font-weight:700;text-decoration:underline">Go to sign in</a> to request a new reset link, or ask an admin to invite you again.';
      $('mp-form').style.display = 'none';
    }
    if (hash.get('error')) { expired(); return; }
    var tries = 0;
    (function check() {
      sb.auth.getSession().then(function (r) {
        if (r.data && r.data.session) return;
        if (++tries < 6) { setTimeout(check, 400); return; }
        expired();
      });
    })();
    save.addEventListener('click', function () {
      var a = np.value || '', b = cp.value || '';
      if (a.length < 8) { msg('Use at least 8 characters.', 'error'); np.focus(); return; }
      if (a !== b) { msg("Those passwords don't match.", 'error'); cp.focus(); return; }
      msg(''); busy(save, true, 'Saving…');
      sb.auth.updateUser({ password: a }).then(function (r) {
        if (r.error) { busy(save, false); msg(friendly(r.error), 'error'); return; }
        msg('Password saved. Taking you to the dashboard…', 'ok'); setTimeout(function () { location.replace(DASH); }, 700);
      }).catch(function (err) { busy(save, false); msg(friendly(err), 'error'); });
    });
    return;
  }

  /* DASHBOARD (protected) */
  if (page === 'dashboard') {
    var toLogin = function () { location.replace(LOGIN + '?next=' + encodeURIComponent(location.pathname)); };
    sb.auth.getSession().then(function (r) {
      if (!r.data || !r.data.session) { toLogin(); return; }
      return sb.auth.getUser().then(function (u) {
        if (u.error || !u.data || !u.data.user) { sb.auth.signOut().finally(toLogin); return; }
        var el = $('mp-user-email'); if (el) el.textContent = u.data.user.email || 'Admin';
        reveal();
      });
    }).catch(toLogin);
    sb.auth.onAuthStateChange(function (event) { if (event === 'SIGNED_OUT') toLogin(); });
    $('mp-signout').addEventListener('click', function () {
      var b = $('mp-signout'); busy(b, true, 'Signing out…');
      sb.auth.signOut().finally(function () { location.replace(LOGIN); });
    });
  }
})();
