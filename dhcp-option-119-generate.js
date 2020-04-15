#!/usr/bin/env node

// $ ./dhcp-option-119-generate.js z1.prod.hotgarbagellc.net prod.hotgarbagellc.net hotgarbagellc.net


const domains = process.argv.slice(2);


// Array to populate with hex values as the domain search list is built
let hexArray = [];

// Object containing hexArray index values of domain segments
let domainSegmentIndexes = {};


function array2ascii(array) {
	// Convert hexArray into string of ASCII character codes, separated by colons (for Meraki)
	let string = '';

	array.forEach(entry => {
		if (string !== '') string += ':';

		string += entry.toString(16).padStart(2, '0');

		// console.log('entry: %s, hexStr: %s', entry.toString().padStart(3), string);
	});

	return string;
}

// After writing this, I realized that accepting the duplication on the CLI inputs was a mistake,
// evidenced by the fact that I had to hack around it with the compressedCount thing
//
// Oops
//
// It does appear to work though

domains.forEach((domain, domainIndex) => {
	// Split the domain into an array of domain segments, using '.' as the separator
	const domainSegments = domain.split('.');

	// Number of times 0xC0 compression has occured per domain
	let compressedCount = 0;

	domainSegments.forEach((domainSegment, domainSegmentIndex) => {
		if (domainIndex > 1) {
			compressedCount = 1;
			return;
		}

		if (domainIndex > 0 && domainSegmentIndex > 1) {
			compressedCount = 1;
			return;
		}

		// Create an array of ASCII character codes from the domain segment string
		const domainSegmentArray = Array.from(domainSegment).map(c => c.charCodeAt(0));

		// Add segment length to the beginning of the segment array
		domainSegmentArray.unshift(domainSegment.length);

		switch (typeof domainSegmentIndexes[domainSegment]) {
			case 'number' : {
				compressedCount++;

				// Instead append [ 0xC0, segmentIndex ] to hexArray, compliant with the defined compression standard:
				// https://tools.ietf.org/html/rfc1035#section-4.1.4
				hexArray = hexArray.concat([ 0xC0, domainSegmentIndexes[domainSegment] ]);

				break;
			}


			default : {
				// Add domainSegmentArray to global hexArray
				hexArray = hexArray.concat(domainSegmentArray);

				// If this domain segment is newly utilized, store it's index in hexArray in the domainSegmentIndexes object
				domainSegmentIndexes[domainSegment] = (hexArray.length - domainSegmentArray.length);
			}
		}

		// console.log({
		// 	domainSegmentIndexes,

		// 	domain,
		// 	domainIndex,

		// 	domainSegment,
		// 	domainSegmentIndex,

		// 	domainSegmentArray : array2ascii(domainSegmentArray),
		// 	hexArray           : array2ascii(hexArray),
		// });
	});

	// Add null byte terminator after each domain, if no domain compression has occured
	if (compressedCount === 0) hexArray.push(0x00);
});


const hexString = array2ascii(hexArray);


console.log({
	domains,
	hexString,
});
