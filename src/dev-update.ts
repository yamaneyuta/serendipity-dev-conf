// ------------------------------------------------------------
// ※将来的にプライベートリポジトリにバージョンを付与する予定。
// バージョンが付与されれればこのスクリプトは削除する。
// ------------------------------------------------------------
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

const main = async () => {
	await updateRepost();
};

const updateRepost = () => {

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
	
	// dependenciesのパッケージを再インストール
	if ( githubDependencies.length > 0 ) {
		console.log(
			'npm install',
			githubDependencies.map( ( [ key, value ] ) => `${ key }@${ value }` )
		);
		spawn( 'npm', [ 'install', ...githubDependencies.map( ( [ key, value ] ) => `${ key }@${ value }` ) ], {
			stdio: 'inherit',
		} );
	}
	// devDependenciesのパッケージを再インストール
	if ( githubDevDependencies.length > 0 ) {
		console.log(
			'npm install',
			githubDevDependencies.map( ( [ key, value ] ) => `${ key }@${ value }` )
		);
		spawn( 'npm', [ 'install', ...githubDevDependencies.map( ( [ key, value ] ) => `${ key }@${ value }` ) ], {
			stdio: 'inherit',
		} );
	}

};


(async() => {
	await main();
	process.exit( 0 );
} )();