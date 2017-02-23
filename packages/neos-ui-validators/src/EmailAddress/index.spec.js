import test from 'ava';

import emailAddressValidator from './index';

test('"email@domain.com" should be a valid email adress', t => {
    t.is(emailAddressValidator('email@domain.com'), null);
});

test('"firstname.lastname@domain.com" should be a valid email adress', t => {
    t.is(emailAddressValidator('firstname.lastname@domain.com'), null);
});

test('"email@subdomain.domain.com" should be a valid email adress', t => {
    t.is(emailAddressValidator('email@subdomain.domain.com'), null);
});

test('"firstname+lastname@domain.com" should be a valid email adress', t => {
    t.is(emailAddressValidator('firstname+lastname@domain.com'), null);
});

test('"email@123.123.123.123" should be a valid email adress', t => {
    t.is(emailAddressValidator('email@123.123.123.123'), null);
});

test('"1234567890@domain.com" should be a valid email adress', t => {
    t.is(emailAddressValidator('1234567890@domain.com'), null);
});

test('"email@domain-one.com" should be a valid email adress', t => {
    t.is(emailAddressValidator('email@domain-one.com'), null);
});

test('"_______@domain.com" should be a valid email adress', t => {
    t.is(emailAddressValidator('_______@domain.com'), null);
});

test('"email@domain.name" should be a valid email adress', t => {
    t.is(emailAddressValidator('email@domain.name'), null);
});

test('"email@domain.co.jp" should be a valid email adress', t => {
    t.is(emailAddressValidator('email@domain.co.jp'), null);
});

test('"firstname-lastname@domain.com" should be a valid email adress', t => {
    t.is(emailAddressValidator('firstname-lastname@domain.com'), null);
});

test('"plainaddress" should not be a valid email adress', t => {
    t.not(emailAddressValidator('plainaddress'), null);
});

test('"#@%^%#$@#$@#.com" should not be a valid email adress', t => {
    t.not(emailAddressValidator('#@%^%#$@#$@#.com'), null);
});

test('"@domain.com" should not be a valid email adress', t => {
    t.not(emailAddressValidator('@domain.com'), null);
});

test('"Joe Smith <email@domain.com>" should not be a valid email adress', t => {
    t.not(emailAddressValidator('Joe Smith <email@domain.com>'), null);
});

test('"email.domain.com" should not be a valid email adress', t => {
    t.not(emailAddressValidator('email.domain.com'), null);
});

test('"email@domain@domain.com" should not be a valid email adress', t => {
    t.not(emailAddressValidator('email@domain@domain.com'), null);
});

test('".email@domain.com" should not be a valid email adress', t => {
    t.not(emailAddressValidator('.email@domain.com'), null);
});

test('"email.@domain.com" should not be a valid email adress', t => {
    t.not(emailAddressValidator('email.@domain.com'), null);
});

test('"email..email@domain.com" should not be a valid email adress', t => {
    t.not(emailAddressValidator('email..email@domain.com'), null);
});

test('"あいうえお@domain.com" should not be a valid email adress', t => {
    t.not(emailAddressValidator('あいうえお@domain.com'), null);
});

test('"email@domain.com (Joe Smith)" should not be a valid email adress', t => {
    t.not(emailAddressValidator('email@domain.com (Joe Smith)'), null);
});

test('"email@domain" should not be a valid email adress', t => {
    t.not(emailAddressValidator('email@domain'), null);
});

test('"email@-domain.com" should not be a valid email adress', t => {
    t.not(emailAddressValidator('email@-domain.com'), null);
});

test('"email@domain.web" should not be a valid email adress', t => {
    t.not(emailAddressValidator('email@domain.web'), null);
});

test('"email@111.222.333.44444" should not be a valid email adress', t => {
    t.not(emailAddressValidator('email@111.222.333.44444'), null);
});

test('"email@domain..com" should not be a valid email adress', t => {
    t.not(emailAddressValidator('email@domain..com'), null);
});

test('empty value should be valid', t => {
    t.is(emailAddressValidator(''), null);
});
