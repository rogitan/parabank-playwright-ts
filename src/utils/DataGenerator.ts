import { faker } from '@faker-js/faker';

export class DataGenerator {
  static generateRandomUsername(): string {
    return 'tu_' + faker.string.alphanumeric(10);
  }

  static generateUserData() {
    const username = this.generateRandomUsername();
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
      phone: faker.phone.number(),
      ssn: faker.string.numeric(9),
      username,
      password: 'Test@1234',
    };
  }

  static generatePayeeData() {
    return {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
      phone: faker.phone.number(),
      accountNumber: faker.string.numeric(9),
    };
  }
}
