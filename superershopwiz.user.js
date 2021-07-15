// ==UserScript==
// @name         Superer Shop Wizard
// @version      0.4
// @description  Improve SSW even more (for now? just output table for price only results)
// @author       Will
// @match        *://www.neopets.com/*
// @icon         https://www.google.com/s2/favicons?domain=neopets.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let buildRow = function (owner, stock, price, index=1) {
        let dark = !(index % 2); // default 1 => dark = false
        let tr = dark ? '<tr class="darkbg">' : '<tr>';
        return `${tr}<td>${owner}</td><td>${stock}</td><td>${price}</td></tr>`;
    };

    let buildNewRow = function (owner, stock, price) {
        return '<li>'
               + `<div class="ssw-results-grid-user">${owner}</div>`
               + `<div class="ssw-results-grid-stock">${stock}</div>`
               + `<div class="ssw-results-grid-price">${price}</div>`
               + '</li>';
    }

    $( document ).ajaxSuccess(function( event, xhr, settings ) {
        // OLD SSW
        if ( settings.url.startsWith('/shops/ssw/ssw_query.php') ) {
            //console.log(settings);
            let SSWDATA = JSON.parse(xhr.responseText);
            //console.log(SSWDATA);
            if ( SSWDATA.req.type == '0' && SSWDATA.html && !SSWDATA.html.startsWith('<table') && SSWDATA.data.rowcount > 0 ) {
                //console.log('price only');
                let html = '<table cellspacing="0" cellpadding="0" id="results_table">';
                html += '<tr><th class="ssw_col1">Owner</th><th class="ssw_col2">Stock</th><th class="ssw_col3">Price</th></tr>';
                for (let i = 0; i < 10 && i < SSWDATA.data.rowcount; i++) {
                    html += buildRow('???', SSWDATA.data.amounts[i], SSWDATA.data.price_str[i], i);
                }
                html += '</table>';
                $('#results').html(html);
            }
        }
        // NEW SSW
        else if ( settings.url.includes('/shops/ssw/ssw_query.php') ) {
            //console.log('used new ssw');
            let SSWDATA = JSON.parse(xhr.responseText);
            //console.log(SSWDATA);
            if ( SSWDATA.req.type == '0' && SSWDATA.html && SSWDATA.html.includes('ssw-result-priceonly') && SSWDATA.data.rowcount > 0 ) {
                //console.log('price only');
                let html = '<div class="ssw-results-grid"><ul>';
                html += '<li class="ssw-results-grid-header">';
                html += '<div class="ssw-results-grid-h">Owner</div>';
                html += '<div class="ssw-results-grid-h">Stock</div>';
                html += '<div class="ssw-results-grid-h">Price</div>';
                html += '</li>';
                for (let i = 0; i < 10 && i < SSWDATA.data.rowcount; i++) {
                    html += buildNewRow('???', SSWDATA.data.amounts[i], SSWDATA.data.price_str[i]);
                }
                html += '</ul></div>';
                $('#sswresults').html(html);
            }
        }
    });
})();
