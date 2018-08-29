Flexible array sorter that sorts an array according to a "position" meta data.

The expected format for the subject is:

```js
[
    [
        'key' => 'bar'
        'position' => '<position-string>',
    ],
    [
        'key' => 'baz'
        'position' => '<position-string>',
    ],
]
```

The <position-string> supports one of the following syntax:

```
start (<weight>)
end (<weight>)
before <key> (<weight>)
after <key> (<weight>)
<numerical-order>
```

where "weight" is the priority that defines which of two conflicting positions overrules the other,
"key" is a string that references another key in the subject
and "numerical-order" is an integer that defines the order independently from the other keys.
