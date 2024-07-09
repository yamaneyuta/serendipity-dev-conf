#!/bin/bash

apt update
apt install git curl -y

# Lazygit
# ※ifの条件に`[]`を使うと`if test xxx;`と同じ意味になるため、`if [ xxx ];`と書かないこと
if "${INSTALL_LAZYGIT}"; then
    LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*')
    curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
    tar xf lazygit.tar.gz lazygit
    install lazygit /usr/local/bin
    rm -rf lazygit*
fi

# Node.js
if "${INSTALL_NODE}"; then
    # hardhat 2.22.3がnodejs 22.x系で動作しないため、20.x系を指定
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install nodejs -y
fi

# Playwright
if "${INSTALL_PLAYWRIGHT}"; then
    yes | npx playwright install --with-deps
fi


# Clean up
apt clean && rm -rf /var/lib/apt/lists/*


# /root/.bashrc内の`#force_color_prompt=yes`のコメントアウトを解除する(rootのターミナル表示に色をつける)
if [ "$(id -u)" = "0" ]; then
    sed -i 's/#force_color_prompt=yes/force_color_prompt=yes/' ~/.bashrc
fi
