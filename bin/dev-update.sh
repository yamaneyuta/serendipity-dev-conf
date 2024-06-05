# このスクリプトが格納されているディレクトリを取得
SCRIPT_DIR=$(cd $(dirname $0); pwd)

if [ $1 = "privateRepos" ]; then
	npx tsx $SCRIPT_DIR/dev-update-private-repos.ts
elif [ $1 = "devcontainer" ]; then
	echo "TODO"
fi
