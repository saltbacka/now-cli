import * as ERRORS from '../errors-ts';
import Client from '../client';
import { Domain } from '../../types';

type Response = {
  domain: Domain;
};

export default async function transferInDomain(
  client: Client,
  name: string,
  authCode: string
) {
  try {
    return await client.fetch<Response>(`/v4/domains`, {
      body: { method: 'transfer-in', name, authCode },
      method: 'POST'
    });
  } catch (error) {
    if (error.code === 'invalid_name') {
      return new ERRORS.InvalidDomain(name);
    }
    if (error.code === 'domain_already_exists') {
      return new ERRORS.DomainNotAvailable(name);
    }
    if (error.code === 'not_transferable') {
      return new ERRORS.DomainNotTransferable(name);
    }
    throw error;
  }
}
