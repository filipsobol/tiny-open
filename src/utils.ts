
/* IMPORT */

import {release} from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawn,spawnSync} from 'node:child_process';

/* MAIN */

const spawnBin = ( bin: string, args: string[] ): Promise<boolean> => {

  return new Promise ( resolve => {

    const process = spawn ( bin, args, {
      detached: true,
      shell: false,
      windowsHide: true
    });

    process.on ( 'close', code => {

      resolve ( !code );

    });

  });

};

const toWindowsPath = ( p: string ) => {

  if ( !isWsl ) {

    return p;

  }

  if ( !URL.canParse ( p ) ) {

    // Transform Linux path to Windows path.
    return getWindowsPath ( p );

  }

  if ( new URL ( p ).protocol === 'file:' ) {

    // Transform Linux file URL to Windows path.
    return getWindowsPath ( fileURLToPath ( p ) );

  }

  // Leave other URLs unchanged.
  return p;

}

const getWindowsPath = ( p: string ) => {

  const out = spawnSync ( 'wslpath', [ '-w', p ], { encoding: 'utf8' } );

  return out.status === 0 ? out.stdout.trim() : p;

};

const isWsl = process.platform === 'linux' && release().toLowerCase().includes ( 'microsoft' );

/* EXPORT */

export {spawnBin,toWindowsPath, isWsl};
