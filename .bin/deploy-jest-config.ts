import path from 'node:path';
import { deployToProjects } from './lib/deployToProjects';

const main = () => {
	// コピー元ファイルパス
	const src = path.join( process.cwd(), 'jest', 'jest.common.config.js' );

	// コピー先プロジェクトにおける相対パス
	const destRelativeDir = '.';

	// 他プロジェクトにファイルをコピー
	deployToProjects( src, destRelativeDir );
};
main();
