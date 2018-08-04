// MIT License
//
// Copyright (c) 2018 mdsf contributors
// (see https://github.com/metarhia/mdsf/blob/master/AUTHORS).
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const readline = require('readline');

const UNICODE_CATEGORIES = ['Lu', 'Ll'];
const UNICODE_VERSION = '11.0.0';
const UCD_LINK = 'http://www.unicode.org/Public/' + UNICODE_VERSION +
  '/ucd/UnicodeData.txt';

const OUTPUT_PATH = path.join(__dirname, '../lib/utils/unicode-categories.js');

const getFileHeader = () =>
  `// Copyright (c) 2018 mdsf project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
//
//
// This file contains data derived from the Unicode Data Files.
// The following license applies to this data:
//
// COPYRIGHT AND PERMISSION NOTICE
//
// Copyright © 1991-2018 Unicode, Inc. All rights reserved.
// Distributed under the Terms of Use in http://www.unicode.org/copyright.html.
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of the Unicode data files and any associated documentation
// (the "Data Files") or Unicode software and any associated documentation
// (the "Software") to deal in the Data Files or Software
// without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, and/or sell copies of
// the Data Files or Software, and to permit persons to whom the Data Files
// or Software are furnished to do so, provided that either
// (a) this copyright and permission notice appear with all copies
// of the Data Files or Software, or
// (b) this copyright and permission notice appear in associated
// Documentation.
//
// THE DATA FILES AND SOFTWARE ARE PROVIDED "AS IS", WITHOUT WARRANTY OF
// ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT OF THIRD PARTY RIGHTS.
// IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS
// NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL
// DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
// DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
// TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THE DATA FILES OR SOFTWARE.
//
// Except as contained in this notice, the name of a copyright holder
// shall not be used in advertising or otherwise to promote the sale,
// use or other dealings in these Data Files or Software without prior
// written authorization of the copyright holder.
//
//
// This file is automatically generated by tools/unicode-category-parcer.js.
// Unicode version ${UNICODE_VERSION}.
//
// Do not edit this file manually!
/* eslint-disable */
module.exports = `;

const resultObject = {};
resultObject.addRange = range => {
  if (range.max) {
    resultObject[range.category].push([range.min, range.max]);
  } else if (range.min) {
    resultObject[range.category].push(range.min);
  }
};

UNICODE_CATEGORIES.forEach(category => {
  resultObject[category] = [];
});

http.get(UCD_LINK, (res) => {
  const linereader = readline.createInterface({ input: res, historySize: 0 });
  let prevCategory;
  let range = {};
  linereader.on('line', (line) => {
    const [code,, category] = line.split(';');
    if (UNICODE_CATEGORIES.includes(category)) {
      const decimalCode = parseInt(code, 16);
      if (category === prevCategory) {
        range.max = decimalCode;
      } else {
        resultObject.addRange(range);
        range = { min: decimalCode, max: undefined, category };
      }
    }
    prevCategory = category;
  });


  linereader.on('close', () => {
    resultObject.addRange(range);
    const resultData = getFileHeader() + JSON.stringify(resultObject) + '\n';
    fs.writeFileSync(OUTPUT_PATH, resultData);
  });
});
