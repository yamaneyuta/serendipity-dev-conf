// ------------------------------------------------------------
// ※将来的にプライベートリポジトリにバージョンを付与する予定。
// バージョンが付与されれればこのスクリプトは削除する。
// ------------------------------------------------------------
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

const main = async () => {
	// 実行時の引数を取得
	const args = process.argv.slice( 2 );
	if ( args.length === 0 ) {
		console.log( 'Usage: dev-update <option>' );
		process.exit( 1 );
	}

	switch ( args[ 0 ] ) {
		case 'package':
			await updatePackages();
			break;
		case 'devcontainer':
			await updateDevContainerFiles();
			break;
		default:
			console.log( `Unknown option: ${ args[ 0 ] }` );
			process.exit( 1 );
	}
};

const updatePackages = async () => {
	// コマンドを実行したディレクトリにあるpackage.jsonを読み込む
	const cwd = process.cwd();
	const packageJsonPath = path.join( cwd, 'package.json' );
	const packageJson = JSON.parse( fs.readFileSync( packageJsonPath, 'utf-8' ) );

	// githubを参照しているリポジトリ＝プライベートリポジトリ
	// 依存関係にgithub:が含まれるものを抽出
	const githubDependencies = Object.entries( packageJson.dependencies ).filter( ( [ key, value ] ) =>
		( value as string ).startsWith( 'github:' )
	);
	const githubDevDependencies = Object.entries( packageJson.devDependencies ).filter( ( [ key, value ] ) =>
		( value as string ).startsWith( 'github:' )
	);

	// githubを参照しているリポジトリが無い場合は終了
	if ( githubDependencies.length === 0 && githubDevDependencies.length === 0 ) {
		console.log( 'No github dependencies' );
		process.exit( 0 );
	}

	// githubを参照しているリポジトリをすべて削除する
	const deletePackages = [ ...githubDependencies, ...githubDevDependencies ].map( ( [ key, value ] ) => key );
	console.log( 'deletePackages', deletePackages );
	spawn( 'npm', [ 'uninstall', ...deletePackages ], { stdio: 'inherit' } );

	const promises = [] as Promise< void >[];

	// dependenciesのパッケージを再インストール
	if ( githubDependencies.length > 0 ) {
		console.log(
			'npm install',
			githubDependencies.map( ( [ key, value ] ) => `${ key }@${ value }` )
		);
		const p = spawn(
			'npm',
			[ 'install', ...githubDependencies.map( ( [ key, value ] ) => `${ key }@${ value }` ) ],
			{
				stdio: 'inherit',
			}
		);

		promises.push(
			new Promise< void >( ( resolve, reject ) => {
				p.on( 'close', ( code ) => {
					if ( code === 0 ) {
						resolve();
					} else {
						reject( code );
					}
				} );
			} )
		);
	}
	// devDependenciesのパッケージを再インストール
	if ( githubDevDependencies.length > 0 ) {
		console.log(
			'npm install',
			githubDevDependencies.map( ( [ key, value ] ) => `${ key }@${ value }` )
		);
		const p = spawn(
			'npm',
			[ 'install', '-d', ...githubDevDependencies.map( ( [ key, value ] ) => `${ key }@${ value }` ) ],
			{
				stdio: 'inherit',
			}
		);

		promises.push(
			new Promise< void >( ( resolve, reject ) => {
				p.on( 'close', ( code ) => {
					if ( code === 0 ) {
						resolve();
					} else {
						reject( code );
					}
				} );
			} )
		);
	}

	await Promise.all( promises );
};

const updateDevContainerFiles = async () => {
	// ../dockerディレクトリにあるファイル一覧を取得
	const dockerDir = path.join( __dirname, '..', 'docker', '.devcontainer' );
	const files = fs.readdirSync( dockerDir );

	const cwd = process.cwd();
	// 同じ名前のファイルが実行ディレクトリの.devcontainer以下に存在する場合は上書き
	for ( const file of files ) {
		const srcPath = path.join( dockerDir, file );
		const destPath = path.join( cwd, '.devcontainer', file );
		if ( fs.existsSync( destPath ) ) {
			fs.copyFileSync( srcPath, destPath );
			console.log( `Copy ${ srcPath } to ${ destPath }` );
		}
	}
};

( async () => {
	await main();
	process.exit( 0 );
} )();
