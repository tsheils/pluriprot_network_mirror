import { DomSanitizer } from '@angular/platform-browser';
import {TestBed, inject, async} from '@angular/core/testing';

import { HighlightPipe } from './highlight.pipe';

describe('AutoComplete Component - Highlight pipe', () => {
  let pipe: HighlightPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ {
        provide: DomSanitizer,
        useValue: {
          bypassSecurityTrustHtml: v => v
        }
      }, HighlightPipe
      ]
    });
  })
);

  beforeEach(inject([HighlightPipe], p => {
    pipe = p;
  }));

  it('highlights search term in the text', () => {
    const result = pipe.transform('search text', 'text');
    expect(result).toBe('search <span class="search-highlight">text</span>');
  });

  it('shoudl return same text', () => {
    const result = pipe.transform('search text', '');
    expect(result).toBe('search text', 'search text');
  });
});
