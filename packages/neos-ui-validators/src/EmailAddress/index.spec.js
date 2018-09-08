import emailAddressValidator from './index';

test('"email@domain.com" should be a valid email adress', () => {
    expect(emailAddressValidator('email@domain.com')).toBe(null);
});

test('"firstname.lastname@domain.com" should be a valid email adress', () => {
    expect(emailAddressValidator('firstname.lastname@domain.com')).toBe(null);
});

test('"email@subdomain.domain.com" should be a valid email adress', () => {
    expect(emailAddressValidator('email@subdomain.domain.com')).toBe(null);
});

test('"firstname+lastname@domain.com" should be a valid email adress', () => {
    expect(emailAddressValidator('firstname+lastname@domain.com')).toBe(null);
});

test('"email@123.123.123.123" should be a valid email adress', () => {
    expect(emailAddressValidator('email@123.123.123.123')).toBe(null);
});

test('"1234567890@domain.com" should be a valid email adress', () => {
    expect(emailAddressValidator('1234567890@domain.com')).toBe(null);
});

test('"email@domain-one.com" should be a valid email adress', () => {
    expect(emailAddressValidator('email@domain-one.com')).toBe(null);
});

test('"_______@domain.com" should be a valid email adress', () => {
    expect(emailAddressValidator('_______@domain.com')).toBe(null);
});

test('"email@domain.name" should be a valid email adress', () => {
    expect(emailAddressValidator('email@domain.name')).toBe(null);
});

test('"email@domain.co.jp" should be a valid email adress', () => {
    expect(emailAddressValidator('email@domain.co.jp')).toBe(null);
});

test('"firstname-lastname@domain.com" should be a valid email adress', () => {
    expect(emailAddressValidator('firstname-lastname@domain.com')).toBe(null);
});

test('"plainaddress" should not be a valid email adress', () => {
    expect(emailAddressValidator('plainaddress')).not.toBe(null);
});

test('"#@%^%#$@#$@#.com" should not be a valid email adress', () => {
    expect(emailAddressValidator('#@%^%#$@#$@#.com')).not.toBe(null);
});

test('"@domain.com" should not be a valid email adress', () => {
    expect(emailAddressValidator('@domain.com')).not.toBe(null);
});

test('"Joe Smith <email@domain.com>" should not be a valid email adress', () => {
    expect(emailAddressValidator('Joe Smith <email@domain.com>')).not.toBe(null);
});

test('"email.domain.com" should not be a valid email adress', () => {
    expect(emailAddressValidator('email.domain.com')).not.toBe(null);
});

test('"email@domain@domain.com" should not be a valid email adress', () => {
    expect(emailAddressValidator('email@domain@domain.com')).not.toBe(null);
});

test('".email@domain.com" should not be a valid email adress', () => {
    expect(emailAddressValidator('.email@domain.com')).not.toBe(null);
});

test('"email.@domain.com" should not be a valid email adress', () => {
    expect(emailAddressValidator('email.@domain.com')).not.toBe(null);
});

test('"email..email@domain.com" should not be a valid email adress', () => {
    expect(emailAddressValidator('email..email@domain.com')).not.toBe(null);
});

test('"あいうえお@domain.com" should not be a valid email adress', () => {
    expect(emailAddressValidator('あいうえお@domain.com')).not.toBe(null);
});

test('"email@domain.com (Joe Smith)" should not be a valid email adress', () => {
    expect(emailAddressValidator('email@domain.com (Joe Smith)')).not.toBe(null);
});

test('"email@domain" should not be a valid email adress', () => {
    expect(emailAddressValidator('email@domain')).not.toBe(null);
});

test('"email@-domain.com" should not be a valid email adress', () => {
    expect(emailAddressValidator('email@-domain.com')).not.toBe(null);
});

test('"email@domain.web" should not be a valid email adress', () => {
    expect(emailAddressValidator('email@domain.web')).not.toBe(null);
});

test('"email@111.222.333.44444" should not be a valid email adress', () => {
    expect(emailAddressValidator('email@111.222.333.44444')).not.toBe(null);
});

test('"email@domain..com" should not be a valid email adress', () => {
    expect(emailAddressValidator('email@domain..com')).not.toBe(null);
});

test('emptyish should pass', () => {
    expect(emailAddressValidator(null)).toBe(null);
    expect(emailAddressValidator(undefined)).toBe(null);
    expect(emailAddressValidator('')).toBe(null);
});
