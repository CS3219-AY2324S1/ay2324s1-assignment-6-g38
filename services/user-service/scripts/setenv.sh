# Export env vars
echo $(grep -v '^#' .env | xargs)
export $(grep -v '^#' .env | xargs)