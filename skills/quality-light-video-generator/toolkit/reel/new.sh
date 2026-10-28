#!/bin/bash
# Start a reel work folder from the template.  Usage: bash studio/reel/new.sh <workdir>
set -e
D=$1; mkdir -p "$D/r" "$D/stills"
cp -r "$(dirname "$0")/template/." "$D/"
echo "reel folder ready: $D"
