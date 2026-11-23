/**
 * Creates a dashboard admin, or resets an admin's password.
 *
 *   npm run admin:create -w backend -- --name "Amina Yusuf" --email amina@school.so
 *   npm run admin:create -w backend -- --email amina@school.so --reset-password
 *
 * The password is typed at a hidden prompt (or read from ADMIN_PASSWORD when set).
 */
import { createInterface } from 'node:readline';
import { parseArgs } from 'node:util';
import { HttpError } from '../lib/http-error.js';
import { connectDatabases, disconnectDatabases } from '../lib/databases.js';
import { createAdmin, resetAdminPassword } from '../modules/admins/admin.service.js';

/** Reads a line without echoing it, so the password doesn't show on screen. */
function promptHidden(question: string): Promise<string> {
  const { stdin, stdout } = process;
  if (!stdin.isTTY) {
    // Piped input: read the first line.
    return new Promise((resolve) => {
      const rl = createInterface({ input: stdin });
      rl.once('line', (line) => {
        rl.close();
        resolve(line);
      });
      rl.once('close', () => resolve(''));
    });
  }

  stdout.write(question);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');

  return new Promise((resolve, reject) => {
    let value = '';
    const finish = (result: () => void) => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
      result();
    };
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') return finish(() => resolve(value));
        if (char === '\u0003') return finish(() => reject(new Error('Cancelled')));
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else value += char;
      }
    };
    stdin.on('data', onData);
  });
}

async function readPassword(): Promise<string> {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  const password = await promptHidden('Password (at least 10 characters): ');
  const again = await promptHidden('Type it again: ');
  if (password !== again) throw new Error('The passwords do not match');
  return password;
}

const { values } = parseArgs({
  options: {
    name: { type: 'string' },
    email: { type: 'string' },
    'reset-password': { type: 'boolean', default: false },
  },
});

if (!values.email || (!values['reset-password'] && !values.name)) {
  console.error(
    'Usage:\n' +
      '  npm run admin:create -w backend -- --name "Full Name" --email you@example.com\n' +
      '  npm run admin:create -w backend -- --email you@example.com --reset-password',
  );
  process.exit(1);
}

try {
  const password = await readPassword();
  await connectDatabases();
  const admin = values['reset-password']
    ? await resetAdminPassword(values.email, password)
    : await createAdmin({ name: values.name ?? '', email: values.email, password });
  console.log(
    values['reset-password']
      ? `Password updated for ${admin.email}`
      : `Created admin ${admin.name} <${admin.email}>`,
  );
} catch (error) {
  if (error instanceof HttpError && Array.isArray(error.details)) {
    const problems = (error.details as { path: string; message: string }[])
      .map((d) => `  ${d.path}: ${d.message}`)
      .join('\n');
    console.error(`${error.message}\n${problems}`);
  } else {
    console.error(error instanceof Error ? error.message : error);
  }
  process.exitCode = 1;
} finally {
  await disconnectDatabases();
}
