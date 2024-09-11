import { Connection, Cluster, clusterApiUrl } from '@solana/web3.js';
import config from '../shared/config';

const SOLANA_CLUSTER = config.get('SOLANA_CLUSTER') as Cluster;

export const connection = new Connection(clusterApiUrl(SOLANA_CLUSTER));

export default connection;
