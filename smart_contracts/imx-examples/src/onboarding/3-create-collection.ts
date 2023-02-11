import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { CreateCollectionParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );
  const projectId = requireEnvironmentVariable('COLLECTION_PROJECT_ID');

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);
  const ownerPublicKey = wallet.publicKey;

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Creating collection...', collectionContractAddress);

  /**
   * Edit your values here
   */
  const params: CreateCollectionParams = {
    name: 'Test Collection',
    description: 'Test description',
    contract_address: collectionContractAddress,
    owner_public_key: ownerPublicKey,
    icon_url: 'https://picsum.photos/id/237/200/300',
    metadata_api_url: 'https://gateway.pinata.cloud/ipfs/QmcENtXVYmEWEAKp3J7shVUnnedXbSHANwiJnJ8ojnuk61',
    collection_image_url: 'https://picsum.photos/seed/picsum/200/300',
    project_id: parseInt(projectId, 10),
  };

  let collection;
  try {
    collection = await user.createCollection(params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, 'Created collection');
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});

// ------ create collection response ------

// {
//   "address": "0xa4c0606ac33586cce748c2b8ba3e78ef4f3b492f",
//   "name": "Test Collection",
//   "description": "Test description",
//   "icon_url": "https://picsum.photos/id/237/200/300",
//   "collection_image_url": "https://picsum.photos/seed/picsum/200/300",
//   "project_id": 2062,
//   "project_owner_address": "",
//   "metadata_api_url": "https://gateway.pinata.cloud/ipfs/QmcENtXVYmEWEAKp3J7shVUnnedXbSHANwiJnJ8ojnuk61",
//   "created_at": "2023-02-10T19:53:04.567781Z",
//   "updated_at": "2023-02-10T19:53:04.567781Z"
// }