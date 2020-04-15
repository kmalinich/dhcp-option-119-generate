# dhcp-option-119-generator

Generate hex value for Meraki DHCP option 119 (search domain list). It ain't great, but it might help.

## Input

```sh
~ $ ./dhcp-option-119-generate.js z1.prod.hotgarbagellc.net prod.hotgarbagellc.net hotgarbagellc.net
```

## Output

```javascript
{
  domains: [
    'z1.prod.hotgarbagellc.net',
    'prod.hotgarbagellc.net',
    'hotgarbagellc.net'
  ],
  hexString: '02:7a:31:04:70:72:6f:64:0d:68:6f:74:67:61:72:62:61:67:65:6c:6c:63:03:6e:65:74:00:c0:03:c0:08'
}

```

## Thanks

* [u/NoTheOtherRick on Reddit's comment](https://old.reddit.com/r/fortinet/comments/bskbzg/dhcp_option_119_domain_search/esor6rp/)
* [BrechtSchamp on Meraki community forums](https://community.meraki.com/t5/Security-SD-WAN/DHCP-Option-43-and-Sub-option/m-p/47562/highlight/true#M11987)
* [RFC 3397](https://tools.ietf.org/html/rfc3397)
* [RFC 1035 section 4.1.4](https://tools.ietf.org/html/rfc1035#section-4.1.4)
