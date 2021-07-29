// ==UserScript==
// @name         Caption Contest Sorter
// @version      1.2
// @description  Sort captions by votes
// @author       Will
// @match        http://www.neopets.com/games/caption_browse.phtml*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let getNSpaces = function ( n ) {
        return " ".repeat(n);
    };

    let numDigits = function ( n ) {
        return Math.floor( Math.log10( n ) ) + 1;
    };

    let captionRegex = /<b>By (.*?):<\/b>[\s\S]*?([0-9,]+) votes so far.*?Vote for me here!<\/b><\/a>(?:<\/p>)?<p>/g;

    let bodyHTML = $('body').html();

    let m;
    let data = [];
    do {
        m = captionRegex.exec(bodyHTML);
        if (m)
            data.push({name: m[1], votes: parseInt(m[2].replace(/,/g, '')), para: m[0]});
    } while (m);

    if ( data.length === 0 ) {
        return;
    }

    let longestUsername = Math.max(...data.map(function(v) { return v.name.length; }));
    data.sort(function(a, b){
        let diff = b.votes - a.votes;
        if ( diff === 0 ) {
            return a.name > b.name ? 1 : -1;
        }
        return diff;
    });

    let t = '';
    let c = 1;
    let sum = 0;
    for(let v of data) {
        let style = c == 1 || c == 26 ? '%c' : '';
        let leadingSpace = getNSpaces( numDigits(data.length) - numDigits(c) );
        let spacesNeeded = longestUsername - v.name.length + 3;
        t += `${style}${leadingSpace}${c}. ${v.name}${getNSpaces(spacesNeeded)}${v.votes}\n`;
        c++;
        sum += v.votes;
    }

    t  += `\n%cTotal votes cast: ${Number(sum).toLocaleString()}\n`;

    console.log(t, 'color: green', 'color: red', 'font-weight: bold');

    let img = $('center:has(img[src*="/caption/"])');
    let pElem = $('p:has(br[clear])').get(0);
    let parent = img.get(0).parentNode;
    let sib;
    let node = img.get(0).nextSibling;
    do {
        sib = node.nextSibling;
        parent.removeChild(node);
        node = sib;
    } while ( sib != pElem );

    for ( let i = data.length - 1; i >= 0; i-- ) {
        let caption = data[i].para.replace(/<\/?p>/g, '');
        img.after($(`<p>${caption}</p>`));
        if ( i == 25 ) {
            img.after($("<hr>"));
        }
    }
})();
