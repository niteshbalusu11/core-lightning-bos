import { credentials as _credentials, loadPackageDefinition } from '@grpc/grpc-js';

import { cwd } from 'process';
import getSavedCredentials from './get_saved_credentials.js';
import { join } from 'path';
import { loadSync } from '@grpc/proto-loader';

const PROTO_PATH = join(cwd(), 'core-lightning', 'proto', 'node.proto');
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

/** Get Authenticated Lightning Object
 *
 * @param {
 * node: <Saved Node String>
 * }
 * @returns {
 * lightning: <Authenticated Core Lightning Object>
 * }
 */

const authenticatedCoreLightning = async ({ node }) => {
  const credentials = await getSavedCredentials({ node });

  const packageDefinition = loadSync(PROTO_PATH, options);

  const CLNService = loadPackageDefinition(packageDefinition).cln.Node;
  const sslCredentials = _credentials.createSsl(credentials.ca_cert, credentials.client_key, credentials.client_cert);

  const lightning = new CLNService(credentials.socket, sslCredentials);

  return { lightning };
};

export default authenticatedCoreLightning;
