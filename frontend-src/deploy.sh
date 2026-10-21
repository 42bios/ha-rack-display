#!/bin/zsh
# Baut das Frontend und spielt die Integration per SSH auf den HA-Host ein (ohne Neustart).
# Zugangsdaten kommen aus frontend-src/deploy.env (nicht im Repository), z. B.:
#   RD_SSH=user@ha-host
#   RD_SSH_KEY=~/.ssh/id_ed25519
#   RD_HA_CONFIG=/config            # Pfad zum HA-Konfigurationsordner auf dem Host
set -e
cd "${0:A:h}"
[[ -f deploy.env ]] && source ./deploy.env
: ${RD_SSH:?RD_SSH fehlt (siehe deploy.env)} ${RD_HA_CONFIG:?RD_HA_CONFIG fehlt (siehe deploy.env)}
python3 build.py $(date +%s)
cd ../custom_components
opts=(-o BatchMode=yes); [[ -n $RD_SSH_KEY ]] && opts+=(-o IdentitiesOnly=yes -i ${~RD_SSH_KEY})
COPYFILE_DISABLE=1 tar --no-xattrs -czf - --exclude __pycache__ rack_display | \
  ssh $opts "$RD_SSH" \
  "tar xzf - -C '$RD_HA_CONFIG/custom_components' 2>/dev/null; echo deployed"
