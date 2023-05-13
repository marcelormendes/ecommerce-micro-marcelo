#!/bin/bash
for user_home in /home/* ; do
  if [ -d "$user_home" ]; then
    username=`basename $user_home`
    echo "Setup $user_home/share folder for $username"
    chmod 777 $user_home/share
  fi
done