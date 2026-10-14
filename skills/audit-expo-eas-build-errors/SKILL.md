---
name: audit-expo-eas-build-errors
description: Evidence-based procedure for diagnosing Expo/EAS build failures (PLUGIN_NOT_FOUND, Cannot find module, config exit 1) — check for Windows-hostile filenames, verify config plugins, and validate lockfile consistency before touching any config.
---

# Audit Expo/EAS build errors (evidence first)

Use when an owner reports Expo/EAS build failures such as `PLUGIN_NOT_FOUND`,
`Cannot find module <pkg>/package.json`, or `expo config` exit code 1. The goal
is to find the REAL root cause with evidence — not to guess at config fixes
(no speculative lockfile deletion, no speculative dependency additions).

## 1. Get the ground truth about the committed config

On a clean checkout of the repo's `main`:

```bash
cat mobile/package.json mobile/app.json mobile/eas.json
```

Verify the three claims that most often get mis-diagnosed:

1. **Is the failing package actually declared?** `grep '"<pkg>"' mobile/package.json`
   and confirm the lockfile resolves it: `grep -A1 '"node_modules/<pkg>"' mobile/package-lock.json`.
2. **Does the failing profile need the missing module?** Read `eas.json`: a profile
   with only `buildType` and no `developmentClient` is a plain store-style build —
   `expo-dev-client` is NOT required.
3. **Does the package actually ship a config plugin?** Download the exact tarball
   from the npm registry and check for `app.plugin.js`:
   ```bash
   url=$(curl -s "https://registry.npmjs.org/<pkg>/<ver>" | python3 -c "import sys,json; print(json.load(sys.stdin)['dist']['tarball'])")
   curl -s "$url" -o /tmp/p.tgz && tar -tzf /tmp/p.tgz | grep -E 'app\.plugin\.js|expo-module\.config\.json'
   ```
   Many Expo packages (e.g. `expo-status-bar@56.x`, `expo-web-browser@56.x`) DO ship
   `app.plugin.js` — so a `PLUGIN_NOT_FOUND` for them means the module is NOT
   installed (broken node_modules), not that the declaration is wrong.

## 2. Check for Windows-hostile filenames (common hidden root cause)

A tracked filename containing literal backslash characters (`\`) cannot be checked
out on Windows (`\` is the path separator there), breaking clone/checkout and
leaving node_modules stale → cascading Expo errors.

```bash
# -z + od -c shows the exact bytes (xxd may not be installed)
git ls-files -z mobile/ | od -c | head
# look for:  \   [   i   d   \   ]   .   t   s   x   (literal backslashes)

# find ALL tracked files with suspicious chars: \ < > : " | ? *
git ls-files | grep -P '[\x5c\x3c\x3e\x3a\x22\x7c\x3f\x2a]' || echo "(none)"
```

If found, the fix is to delete the stray file (`git rm -- '<path>'`) and keep the
canonical one — verify with `git ls-files mobile/app/` after. On Windows this is
the root cause of otherwise inexplicable build failures.

## 3. Validate the lockfile is consistent (proves deletion is wrong)

```bash
cd mobile && node -e '
const pkg = require("./package.json");
const lock = require("./package-lock.json");
const root = lock.packages[""].dependencies || {};
const dev = lock.packages[""].devDependencies || {};
const missing = Object.keys({...pkg.dependencies, ...pkg.devDependencies})
  .filter(k => root[k] === undefined && dev[k] === undefined);
console.log("missing from lockfile root:", missing.length ? missing : "NONE");
for (const k of ["node_modules/expo","node_modules/react-native","node_modules/expo-router"]) {
  console.log(k, "=>", lock.packages[k] ? lock.packages[k].version : "MISSING");
}'
```

`missing: NONE` + matching versions ⇒ the lockfile is fine — never recommend
deleting it.

## 4. Sanity check: does a healthy environment resolve the config?

If a teammate's workspace (e.g. `/home/team/shared/mobile/`) has node_modules:
check every plugin's `app.plugin.js` exists, then run `npx expo config --json`
(or look for saved `config_out.json` / `debug_config.log` artifacts). Success here
proves the committed config is sound and the failure is environmental.

## Gotchas

- `gh auth status` often reports an invalid `GH_TOKEN`; get a working token with
  `printf 'protocol=https\nhost=github.com\n\n' | git credential fill` and use it
  as `Authorization: Bearer` for the GitHub REST API.
- Tokens expire hourly — re-run `git credential fill` (or call the credentials
  refresh tool) before any push/API call that fails with 401.
- Windows filenames also can't contain `< > : " | ? *` — the grep above catches all.
- Only make a narrowly-scoped PR if a real fix is needed; report the diagnosis
  first. Don't "fix" package.json/app.json/eas.json if the evidence says they are correct.
