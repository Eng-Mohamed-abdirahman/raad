import * as argon2 from 'argon2';

/** Hashes a password with argon2id (the library default). */
export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

let dummyHash: Promise<string> | undefined;

/**
 * Runs a password check that always fails. Login calls it for an unknown email,
 * so a wrong email takes as long as a wrong password and can't be told apart.
 */
export async function verifyAgainstDummy(password: string): Promise<false> {
  dummyHash ??= hashPassword('dummy-password-for-timing');
  await argon2.verify(await dummyHash, password);
  return false;
}
