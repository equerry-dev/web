#!/usr/bin/env bash
#
# Build the static-site image, run it, and smoke nginx routing through the
# container: clean URLs must serve 200, and an unknown path must return the
# branded 404.html app shell with a 404 status. Used locally and as the CI
# gate that runs before the image is published.
#
set -euo pipefail

IMAGE="equerry-web:smoke"
NAME="equerry-web-smoke-$$"
PORT="${SMOKE_PORT:-8088}"
BASE="http://localhost:${PORT}"

cleanup() {
	docker rm -f "$NAME" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "==> Building image"
docker build -t "$IMAGE" .

echo "==> Starting container on :${PORT}"
docker run -d --name "$NAME" -p "${PORT}:80" "$IMAGE" >/dev/null

echo "==> Waiting for nginx"
for _ in $(seq 1 30); do
	if curl -fsS -o /dev/null "${BASE}/"; then break; fi
	sleep 1
done

fail=0

check_status() {
	local path="$1" expected="$2" code
	code=$(curl -s -o /dev/null -w '%{http_code}' "${BASE}${path}")
	if [ "$code" = "$expected" ]; then
		echo "ok   ${path} -> ${code}"
	else
		echo "FAIL ${path} -> ${code} (expected ${expected})"
		fail=1
	fi
}

# Clean URLs resolve to <route>.html through nginx try_files.
check_status "/" 200
check_status "/docs/install" 200

# Unknown path -> branded 404 (error_page 404 /404.html), keeping the 404 status.
check_status "/no-such-page" 404
if ! curl -s "${BASE}/no-such-page" | grep -q "/_app/"; then
	echo "FAIL /no-such-page did not serve the 404 app shell"
	fail=1
fi

if [ "$fail" -ne 0 ]; then
	echo "==> Docker smoke FAILED"
	exit 1
fi
echo "==> Docker smoke passed"
