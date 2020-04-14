#!/usr/bin/env node

// node dhcp-option-119-generate.js z1.prod.hotgarbagellc.net prod.hotgarbagellc.net hotgarbagellc.net


const domains = process.argv.slice(2);


// Array to populate with hex values as the domain search list is built
let hexArray = [];

// Object containing hexArray index values of domain segments
let domainSegmentIndexes = {};


domains.forEach(domain => {
	// Split the domain into an array of domain segments, using '.' as the separator
	const domainSegments = domain.split('.');

	domainSegments.forEach(domainSegment => {
		// Create an array of ASCII character codes from the domain segment string
		const domainSegmentArray = Array.from(domainSegment).map(c => c.charCodeAt(0));

		// Add segment length to the beginning of the segment array
		domainSegmentArray.unshift(domainSegment.length);

		switch (typeof domainSegmentIndexes[domainSegment]) {
			case 'number' : {
				// Instead append [ 0xC0, segmentIndex ] to hexArray, compliant with the defined compression standard:
				// https://tools.ietf.org/html/rfc1035#section-4.1.4
				hexArray = hexArray.concat([ 0xC0, domainSegmentIndexes[domainSegment] ]);

				break;
			}


			default : {
				// Add null byte terminator to the end of the segment array
				domainSegmentArray.push(0x00);

				// Add domainSegmentArray to global hexArray
				hexArray = hexArray.concat(domainSegmentArray);

				// If this domain segment is newly utilized, store it's index in hexArray in the domainSegmentIndexes object
				domainSegmentIndexes[domainSegment] = (hexArray.length - domainSegmentArray.length);
			}
		}


		// console.log({
		// 	domainSegmentIndexes,

		// 	domain,
		// 	domainSegment,

		// 	domainSegmentArray : Buffer.from(domainSegmentArray),
		// 	hexArray           : Buffer.from(hexArray),
		// });
	});
});


// Convert hexArray into string of hex characters, separated by colons (for Meraki)
let hexString = '';

hexArray.forEach(entry => {
	if (hexString !== '') hexString += ':';

	hexString += entry.toString(16).padStart(2, '0');

	// console.log('entry: %s, hexStr: %s', entry.toString().padStart(3), hexString);
});

console.log({
	domains,
	hexString,
});
