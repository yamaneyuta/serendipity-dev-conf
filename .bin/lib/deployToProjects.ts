import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

/**
 * 別プロジェクトにファイルをコピーします。
 *
 * @param src コピー元ファイルパス(本プロジェクト内ファイル)
 * @param destRelativeDir コピー先プロジェクトにおける相対パス(別プロジェクト)
 */
export const deployToProjects = ( src: string, destRelativeDir: string ) => {
	// srcファイル名を取得
	const srcFileName = path.basename( src );
	// コピー元ハッシュ値を取得
	const srcHash = md5( fs.readFileSync( src, 'utf-8' ) );

	// コピー先候補となるプロジェクトディレクトリ一覧を取得
	const projectDirs = getProjectDirs();

	for ( const projectDir of projectDirs ) {
		const dest = path.join( projectDir, destRelativeDir, srcFileName );
		// コピー先に同名のファイルが存在する場合のみコピー
		if ( fs.existsSync( dest ) ) {
			// コピー先ハッシュ値を取得
			const destHash = md5( fs.readFileSync( dest, 'utf-8' ) );
			// ハッシュ値が異なる場合のみコピー
			if ( srcHash !== destHash ) {
				fs.copyFileSync( src, dest );
				console.log( path.resolve( dest ) ); // eslint-disable-line no-console
			}
		}
	}
};

/**
 * プロジェクトのディレクトリ一覧を取得します。
 */
const getProjectDirs = () => {
	// 現在ディレクトリの親ディレクトリに存在するディレクトリ一覧を取得
	const projectsRootDir = path.join( process.cwd(), '..' );
	const dirs = fs
		.readdirSync( projectsRootDir, { withFileTypes: true } )
		.filter( ( dirent ) => dirent.isDirectory() )
		.map( ( dirent ) => path.join( '..', dirent.name ) );
	return dirs;
};

/**
 * 文字列のMD5ハッシュ値を取得します。
 */
const md5 = ( str: string ) => {
	const hash = crypto.createHash( 'md5' );
	hash.update( str );
	return hash.digest( 'hex' );
};
