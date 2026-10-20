import type { Address, AddressInput, ProfileInput } from "../domain/address";

/** Port : persistance des informations et adresses d'un client, toujours scopée par son identifiant. */
export interface AccountRepository {
  getProfile(userId: string): Promise<ProfileInput | null>;
  updateProfile(userId: string, input: ProfileInput): Promise<void>;
  listAddresses(userId: string): Promise<Address[]>;
  saveAddress(userId: string, input: AddressInput, id?: string): Promise<Address>;
  deleteAddress(userId: string, id: string): Promise<void>;
  setDefaultAddress(userId: string, id: string): Promise<void>;
}
