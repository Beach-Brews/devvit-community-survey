/*!
* A very basic and watered-down markdown flavor. Currently only supports:
* Paragraphs -> Double line break
* New Lines -> Double space
* *italic text*
* **bold text**
* __underlined text__
* ~~crossed out text~~
* [Link Text](https://link)
* ![alt text](https://i.reddit.com/link) -> Shows a "show image" link and shows image in a modal
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import React, { JSX } from 'react';
import { navigateTo } from '@devvit/web/client';

export type ElementOrString = JSX.Element | string;
export type MarkdownList = ElementOrString[];

export const renderMarkdown = (text: string, stripImg: boolean = false): MarkdownList => {
    return  text.split(/\r\r|\n\n|\r\n\r\n/)
        .map(p => p.trim())
        .filter(Boolean)
        .map((p, i) => mapParagraph(p, i, stripImg));
}

const mapParagraph = (text: string, idx: number, stripImg: boolean): JSX.Element => {
    return (
        <p className="py-1" key={idx}>
            {joinHtml(text.split(/ {2}(?:\r\n|\r|\n)/).map(t => mapText(t, stripImg)), 'br')}
        </p>
    );
};

type TokenMatch = { index: number, content: string, length: number, tag: string | undefined, groups: string[], cb: TokenMatchCallback | undefined };
type TokenMatchCallback = (match: TokenMatch, key: string, stripImg: boolean) => ElementOrString | null;
type MarkdownToken = { regex: RegExp, tag?: string, cb?: TokenMatchCallback };
const TOKENS: MarkdownToken[] = [
    { regex: /(?<!\\)\*\*(.*?\*?)\*\*/, tag: 'strong' },
    { regex: /(?<!\\)\*((?:[^*]|\*\*)+?)\*(?!\*)/, tag: 'em' },
    { regex: /(?<!\\)__([^_]+.*?)__/, tag: 'u' },
    { regex: /(?<!\\)~~([^~]+.*?)~~/, tag: 's' },
    { regex: /(?<!\\)(!?)\[([^\]]+?)]\(([^)]+?)\)/, cb: (match: TokenMatch, key: string, stripImg: boolean) => {
            const [_, media, text, url] = match.groups;
            if (!text || !url) return null;
            if (media === '!') {
                return stripImg ? (<span>[Image: {text}]</span>) : (<img key={key} src={url} alt={text} />);
            }
            return (<button style={{textDecoration: 'underline', cursor: 'pointer'}} key={key} onClick={() => navigateTo(url)}>{mapText(text, stripImg)}</button>);
        }
    }
];

const mapText = (input: string, stripImg: boolean): MarkdownList => {
    const ret: MarkdownList = [];
    let remainingText = input;
    while (remainingText.length > 0) {
        const nextToken = findNextToken(remainingText);
        if (!nextToken) {
            ret.push(remainingText.replace(/\\([*_~])/g, '$1'));
            break;
        }
        if (nextToken.index > 0)
            ret.push(remainingText.substring(0, nextToken.index).replace(/\\([*_~])/g, '$1'));
        if (nextToken.tag)
            ret.push(React.createElement(nextToken.tag, { key: ret.length }, mapText(nextToken.content, stripImg)));
        if (nextToken.cb) {
            const val = nextToken.cb(nextToken, ret.length.toString(), stripImg);
            if (val)
                ret.push(val);
        }
        remainingText = remainingText.substring(nextToken.index + nextToken.length);
    }
    return ret;
};

const findNextToken = (input: string): TokenMatch | null => {
    let best: TokenMatch | null = null;
    for (const t of TOKENS) {
        const match = input.match(t.regex);
        if (!match || match.index === undefined || match[1] === undefined || (best && (match.index > best.index || (match.index == best.index && match[0].length <= best.length)))) continue;
        best = { index: match.index, content: match[1], length: match[0].length, tag: t.tag, groups: [...match], cb: t.cb };
    }
    return best;
};

const joinHtml = (arr: MarkdownList[], joiner: string): MarkdownList => {
    if (arr.length <= 0 || arr[0] === undefined) return [];
    const ret: MarkdownList = [...arr[0]];
    for (let i = 1; i < arr.length; ++i) {
        const v = arr[i];
        if (v === undefined) continue;
        ret.push(React.createElement(joiner, { key: i }));
        ret.push(...v);
    }
    return ret;
};
