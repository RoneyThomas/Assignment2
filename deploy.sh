#!/usr/bin/env bash
# Builds the image with Cloud Build and deploys it to Cloud Run.
# Usage: ./deploy.sh <gcp-project-id> [region] [service-name]
set -euo pipefail

PROJECT_ID="${1:?Usage: ./deploy.sh <gcp-project-id> [region] [service-name]}"
REGION="${2:-us-central1}"
SERVICE="${3:-myportfolio}"

cd "$(dirname "$0")"
[ -f .env ] || { echo ".env not found"; exit 1; }

# Pass MONGODB_URI and JWT_SECRET from .env to Cloud Run (PORT is set by Cloud Run itself)
ENV_FILE="$(mktemp)"
trap 'rm -f "$ENV_FILE"' EXIT
grep -E '^(MONGODB_URI|JWT_SECRET)=' .env | sed -E 's/^([A-Z_]+)=(.*)$/\1: "\2"/' > "$ENV_FILE"

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

gcloud run deploy "$SERVICE" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --env-vars-file "$ENV_FILE" \
  --memory 512Mi \
  --max-instances 2 \
  --quiet

gcloud run services describe "$SERVICE" --region "$REGION" --format 'value(status.url)'
