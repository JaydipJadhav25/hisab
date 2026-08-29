# API hooks

Hand-written TanStack Query + Axios hooks, one folder per resource
(auth, groups, tiffin, hisab, payments, notifications). All requests go
through the shared `axiosInstance` in `src/lib/axios.ts`, which attaches
the saved auth token (localStorage) as an `Authorization: Bearer` header
on every call.

Kept separate from `components/` and `pages/` so the data layer stays a
single, swappable seam — if you introduce Orval-based codegen later, this
is the folder it would replace.
