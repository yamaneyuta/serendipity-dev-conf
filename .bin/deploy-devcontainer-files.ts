import * as fs from 'fs';
import * as path from 'path';
import { deployToProjects } from './lib/deployToProjects';

const SRC_FILES_ROOT_PATH = path.join( __dirname, '..', 'docker/.devcontainer' );

const main = () => {
	// 上書き用ファイル一覧を取得
	const srcFiles = getSyncFiles( SRC_FILES_ROOT_PATH );

	// コピー先プロジェクトにおける相対パス
	const destRelativeDir = './.devcontainer';

	for ( const src of srcFiles ) {
		deployToProjects( src, destRelativeDir );
	}
};

/** コピー元のファイルパス一覧を取得します。 */
const getSyncFiles = ( srcRootPath: string ) => {
	// ファイル一覧を取得
	const fileNames = fs.readdirSync( srcRootPath );

	// パスにして返す
	return fileNames.map( ( fileName ) => path.join( srcRootPath, fileName ) );
};

main();
