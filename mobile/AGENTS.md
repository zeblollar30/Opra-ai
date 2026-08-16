# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Repo convention: never commit filenames with backslashes
Filenames must not contain literal `\` characters (e.g. `\[id\].tsx`). On
Windows `\` is the path separator, so git cannot check such files out and the
whole checkout breaks (see PR #2). Before committing, run:
`git ls-files -z | grep -z '\\\\' && echo "backslash filename found" || true`
