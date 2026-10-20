import { describe, expect, it } from "vitest";
import {
  type Address,
  addressLines,
  pickDefault,
  validateAddress,
  validateProfile,
} from "@/slices/account/domain/address";

const base = {
  label: "Maison",
  firstName: "Bastien",
  lastName: "Corre",
  line1: "12 rue des Lilas",
  line2: "",
  zip: "33000",
  city: "Bordeaux",
  country: "France",
  phone: "",
};

describe("validateAddress", () => {
  it("accepte une adresse complète", () => {
    expect(validateAddress(base)).toEqual({});
  });
  it("exige prénom, nom, adresse, ville et un code postal à 5 chiffres", () => {
    expect(validateAddress({ ...base, firstName: " ", line1: "", zip: "330", city: "" })).toEqual({
      firstName: "required",
      line1: "required",
      zip: "invalid-zip",
      city: "required",
    });
  });
  it("tolère un téléphone vide mais refuse un numéro farfelu", () => {
    expect(validateAddress({ ...base, phone: "06 12 34 56 78" })).toEqual({});
    expect(validateAddress({ ...base, phone: "abc" })).toEqual({ phone: "invalid-phone" });
  });
});

describe("validateProfile", () => {
  it("exige prénom et nom", () => {
    expect(validateProfile({ firstName: "", lastName: "Corre", phone: "" })).toEqual({ firstName: "required" });
  });
});

describe("addressLines / pickDefault", () => {
  it("omet les lignes vides", () => {
    expect(addressLines(base)).toEqual(["Bastien Corre", "12 rue des Lilas", "33000 Bordeaux", "France"]);
  });
  it("préfère l'adresse par défaut, sinon la première", () => {
    const a: Address = { ...base, id: "a", isDefault: false };
    const b: Address = { ...base, id: "b", isDefault: true };
    expect(pickDefault([a, b])?.id).toBe("b");
    expect(pickDefault([a])?.id).toBe("a");
    expect(pickDefault([])).toBeNull();
  });
});
