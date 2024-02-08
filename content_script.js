//new libgen adresses
// https://libgen.is/ (Working – February 2024)
// https://libgen.rs/ – (Working – February 2024)
// https://libgen.st/ (Working August 2023)
traverse(document.body);

function traverse(node) {
	let child, next;

	switch (node.nodeType) {
		case 1:
		case 9:
		case 11:
			child = node.firstChild;
			while (child) {
				next = child.nextSibling;
				traverse(child);
				child = next;
			}
			break;
		case 3:
			handleText(node);
			break;
	}
}

// Produces a link to a search for an isbn on gen.lib.rus.ec
function generateBookLink(isbn) {
	const url = 'http://libgen.is/search.php?req=' + isbn + '&column=identifier"';
	const hyperLink = document.createElement('a');
	const linkText = document.createTextNode(isbn);
	hyperLink.appendChild(linkText);
	hyperLink.href = url;
	hyperLink.target = '_blank';
	return hyperLink;
}

// Function is called on every section of text
function handleText(textNode) {
	const isbnRegex = /(97[89][- ]?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9])/g;
	const textContents = textNode.nodeValue;
	const regexResults = isbnRegex.exec(textContents);

	if (regexResults) {
		// Determine the start and index of regex search
		const startIndex = regexResults.index;
		const endIndex = startIndex + regexResults[0].length;

		// Break up textNode contents into subparts
		const part1 = textContents.substring(0, startIndex);
		const part2 = generateBookLink(regexResults[0]);
		const part3 = textContents.substring(endIndex);

		// console.log(part1);
		// console.log(part3);

		// Create text nodes for subparts
		const part1Node = document.createTextNode(part1);
		const part3Node = document.createTextNode(part3);
		const parentNode = textNode.parentNode;

		// Replace textNode with subparts
		parentNode.replaceChild(part1Node, textNode);
		parentNode.insertBefore(part2, part1Node.nextSibling);
		parentNode.insertBefore(part3Node, part2.nextSibling);
	}
}
