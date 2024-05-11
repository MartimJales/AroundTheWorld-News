#!/bin/sh

# Extract host and port from MONGO_URL (expected format: mongodb://host:port/dbname)
mongo_host=$(echo $MONGO_URL | sed -e 's/mongodb:\/\///' -e 's/\/.*//')
mongo_port=$(echo $mongo_host | sed -e 's/.*://' -e 's/\/.*//')
mongo_host=$(echo $mongo_host | sed -e 's/:.*//')

# Default timeout 60 seconds
timeout=${1:-60}
wait_interval=5  # wait 5 seconds between attempts
elapsed=0

echo "Waiting for MongoDB at $mongo_host:$mongo_port..."
while ! nc -z $mongo_host $mongo_port; do
  elapsed=$(($elapsed + $wait_interval))
  if [ $elapsed -ge $timeout ]; then
    echo "Timed out waiting for MongoDB to respond."
    exit 1
  fi
  echo "MongoDB not available yet, waiting $wait_interval more seconds..."
  sleep $wait_interval
done

echo "MongoDB is up and running at $mongo_host:$mongo_port!"
