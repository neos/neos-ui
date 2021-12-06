import emailAddressValidator from './index';

test('"very.common@example.com" should be a valid email address', () => {
    expect(emailAddressValidator('very.common@example.com')).toBe(null);
});

test('"disposable.style.email.with+symbol@example.com" should be a valid email address', () => {
    expect(emailAddressValidator('disposable.style.email.with+symbol@example.com')).toBe(null);
});

test('"other.email-with-hyphen@example.com" should be a valid email address', () => {
    expect(emailAddressValidator('other.email-with-hyphen@example.com')).toBe(null);
});

test('"fully-qualified-domain@example.com" should be a valid email address', () => {
    expect(emailAddressValidator('fully-qualified-domain@example.com')).toBe(null);
});

test('"user.name+tag+sorting@example.com" should be a valid email address', () => {
    expect(emailAddressValidator('user.name+tag+sorting@example.com')).toBe(null);
});

test('"x@example.com" should be a valid email address', () => {
    expect(emailAddressValidator('x@example.com')).toBe(null);
});

test('"example-indeed@strange-example.com" should be a valid email address', () => {
    expect(emailAddressValidator('example-indeed@strange-example.com')).toBe(null);
});

test('"admin@mailserver1" should be a valid email address', () => {
    expect(emailAddressValidator('admin@mailserver1')).toBe(null);
});

test('"example@s.example" should be a valid email address', () => {
    expect(emailAddressValidator('example@s.example')).toBe(null);
});

test('""john..doe"@example.org" should be a valid email address', () => {
    expect(emailAddressValidator('"john..doe"@example.org')).toBe(null);
});

test('"mailhost!username@example.org" should be a valid email address', () => {
    expect(emailAddressValidator('mailhost!username@example.org')).toBe(null);
});

test('"user%example.com@example.org" should be a valid email address', () => {
    expect(emailAddressValidator('user%example.com@example.org')).toBe(null);
});

test('"hellö@neos.io" should be a valid email address', () => {
    expect(emailAddressValidator('hellö@neos.io')).toBe(null);
});

test('"1500111@профи-инвест.рф" should be a valid email address', () => {
    expect(emailAddressValidator('1500111@профи-инвест.рф')).toBe(null);
});

test('"user@localhost.localdomain" should be a valid email address', () => {
    expect(emailAddressValidator('user@localhost.localdomain')).toBe(null);
});

test('"info@guggenheim.museum" should be a valid email address', () => {
    expect(emailAddressValidator('info@guggenheim.museum')).toBe(null);
});

test('"just@test.invalid" should be a valid email address', () => {
    expect(emailAddressValidator('just@test.invalid')).toBe(null);
});

test('"test@[192.168.230.1]" should be a valid email address', () => {
    expect(emailAddressValidator('test@[192.168.230.1]')).toBe(null);
});

test('"Abc.example.com" should not be a valid email address', () => {
    expect(emailAddressValidator('Abc.example.com')).not.toBe(null);
});

test('"A@b@c@example.com" should not be a valid email address', () => {
    expect(emailAddressValidator('A@b@c@example.com')).not.toBe(null);
});

test('"a"b(c)d,e:f;g<h>i[jkl@example.com" should not be a valid email address', () => {
    expect(emailAddressValidator('a"b(c)d,e:f;g<h>i[jkl@example.com')).not.toBe(null);
});

test('"just"not"right@example.com" should not be a valid email address', () => {
    expect(emailAddressValidator('just"not"right@example.com')).not.toBe(null);
});

test('"this is"notallowed@example.com" should not be a valid email address', () => {
    expect(emailAddressValidator('this is"notallowed@example.com')).not.toBe(null);
});

// eslint-disable-next-line
test('"this still"not\allowed@example.com" should not be a valid email address', () => {
    // eslint-disable-next-line
    expect(emailAddressValidator('this still"not\allowed@example.com')).not.toBe(null);
});

test('"andreas.foerthner@" should not be a valid email address', () => {
    expect(emailAddressValidator('andreas.foerthner@')).not.toBe(null);
});

test('"@neos.io" should not be a valid email address', () => {
    expect(emailAddressValidator('@neos.io')).not.toBe(null);
});

test('"someone@neos." should not be a valid email address', () => {
    expect(emailAddressValidator('someone@neos.')).not.toBe(null);
});

test('"[2001:db8:85a3:8d3:1319:8a2e:370]" should not be a valid email address', () => {
    expect(emailAddressValidator('[2001:db8:85a3:8d3:1319:8a2e:370]')).not.toBe(null);
});

test('"[2001:db8:85a3:8d3:1319:8a2e:bar:7348]" should not be a valid email address', () => {
    expect(emailAddressValidator('[2001:db8:85a3:8d3:1319:8a2e:bar:7348]')).not.toBe(null);
});

test('emptyish should pass', () => {
    expect(emailAddressValidator(null)).toBe(null);
    expect(emailAddressValidator(undefined)).toBe(null);
    expect(emailAddressValidator('')).toBe(null);
});

