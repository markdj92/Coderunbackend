import { tags as t } from '@lezer/highlight';
import { createTheme } from 'thememirror';

export const theme = {
  color: {
    DimmedBlack: 'rgba(7, 7, 7, 0.80)',
    PageBackground: '#26262d',
    PopupBackground: '#26262d',
    Black: '#26262d',
    DarkGray: '#838393',
    LightGray: '#C3C3D6',
    MainKeyColor: '#6BD9A4',
    MainKeyLightColor: '#92dab8',
    MainKeyDarkColor: '#54a980',
    SubColor: '#A1F4FF',
    Error: '#FF5C5C',
    Divider: '#474754',
    FocusShadow: '#59FFF5CC',
    ErrorShadow: '#FF5C5CCC',
    NonFocused: '#6BD9A480',
  },
  font: {
    Title: "'IBM Plex Sans KR', sans-serif",
    Content: "'Noto Sans KR', sans-serif",
  },
  size: {
    ThickBorder: '6px solid',
    ThinBorder: '3px solid',
    BigBoxShadow: '0px 0px 30px 0px',
  },
};

export const customEditorTheme = createTheme({
  variant: 'dark',
  settings: {
    background: '#263747',
    foreground: '#f8f8f2',
    caret: '#f8f8f0',
    selection: '#44576C',
    lineHighlight: 'transparent',
    gutterBackground: '#263747',
    gutterForeground: '#909194',
  },
  styles: [
    {
      tag: t.comment,
      color: '#6272a4',
    },
    {
      tag: t.variableName,
      color: '#50fa7b',
    },
    {
      tag: [t.string, t.special(t.brace)],
      color: '#f1fa8c',
    },
    {
      tag: t.number,
      color: '#bd93f9',
    },
    {
      tag: t.bool,
      color: '#db93f9',
    },
    {
      tag: t.null,
      color: '#bd93f9',
    },
    {
      tag: t.keyword,
      color: '#ff79c6',
    },
    {
      tag: t.operator,
      color: '#ff79c6',
    },
    {
      tag: t.className,
      color: '#50fa7b',
    },
    {
      tag: t.definition(t.typeName),
      color: '#f8f8f2',
    },
    {
      tag: t.typeName,
      color: '#8be9fd',
    },
    {
      tag: t.angleBracket,
      color: '#50fa7b',
    },
    {
      tag: t.tagName,
      color: '#50fa7b',
    },
    {
      tag: t.attributeName,
      color: '#50fa7b',
    },
  ],
});
