import type { AccountRepository } from "../application/ports";
import type { Address, AddressInput, ProfileInput } from "../domain/address";

/** Sans base : tout vit en mémoire du processus (dev, tests). */
export class InMemoryAccountRepository implements AccountRepository {
  private profiles = new Map<string, ProfileInput>();
  private addresses = new Map<string, Address[]>();

  async getProfile(userId: string) {
    return this.profiles.get(userId) ?? null;
  }
  async updateProfile(userId: string, input: ProfileInput) {
    this.profiles.set(userId, input);
  }
  async listAddresses(userId: string) {
    return [...(this.addresses.get(userId) ?? [])];
  }
  async saveAddress(userId: string, input: AddressInput, id?: string) {
    const list = this.addresses.get(userId) ?? [];
    if (id) {
      const i = list.findIndex((a) => a.id === id);
      if (i < 0) throw new Error("address-not-found");
      list[i] = { ...list[i], ...input };
      this.addresses.set(userId, list);
      return list[i];
    }
    const created: Address = { ...input, id: crypto.randomUUID(), isDefault: list.length === 0 };
    this.addresses.set(userId, [...list, created]);
    return created;
  }
  async deleteAddress(userId: string, id: string) {
    const rest = (this.addresses.get(userId) ?? []).filter((a) => a.id !== id);
    if (rest.length > 0 && !rest.some((a) => a.isDefault)) rest[0] = { ...rest[0], isDefault: true };
    this.addresses.set(userId, rest);
  }
  async setDefaultAddress(userId: string, id: string) {
    this.addresses.set(
      userId,
      (this.addresses.get(userId) ?? []).map((a) => ({ ...a, isDefault: a.id === id })),
    );
  }
}
