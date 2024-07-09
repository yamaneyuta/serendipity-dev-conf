import * as fs from 'fs';
import * as path from 'path';

// プロジェクトのルートディレクトリ(このパスの中にWordPressプラグインリポジトリ等のディレクトリが存在する)
const PROJECT_ROOT_PATH = path.join(__dirname, '..', '..');
const PROJECT_DIR_PREFIX = "serendipity-";
const SRC_FILES_ROOT_PATH = path.join(__dirname, '..', 'docker/.devcontainer');

const main = async () => {

    // プロジェクト関連ディレクトリ一覧を取得
    const projectDirs = getAllProjectDirs(PROJECT_ROOT_PATH, PROJECT_DIR_PREFIX);
    
    // 上書き用ファイル一覧を取得
    const srcFiles = getSyncFiles(SRC_FILES_ROOT_PATH);

    // 各ディレクトリにファイルをコピー
    // ※同じ名前のファイルが存在する場合のみ上書き
    for (const projectDir of projectDirs) {
        for (const srcFile of srcFiles) {
            const destPath = path.join(projectDir, '.devcontainer', path.basename(srcFile));
            if (fs.existsSync(destPath)) {
                fs.copyFileSync(srcFile, destPath);
                console.log(`Copy ${srcFile} to ${destPath}`);
            }
        }
    }
};

/** プロジェクトディレクトリ一覧を取得します。 */
const getAllProjectDirs = (rootPath: string, dirNamePrefix: string) => {
    // ディレクトリ一覧を取得
    const dirNames = fs.readdirSync(rootPath)
        .filter((dirName) => dirName.startsWith(dirNamePrefix));

    // パスにして返す
    return dirNames.map((dirName) => path.join(rootPath, dirName));
};

/** コピー元のファイルパス一覧を取得します。 */
const getSyncFiles = (srcRootPath: string) => {
    // ファイル一覧を取得
    const fileNames = fs.readdirSync(srcRootPath);

    // パスにして返す
    return fileNames.map((fileName) => path.join(srcRootPath, fileName));
};



(async () => {
    await main();
})();
