//@ts-nocheck
import { defaultKeymap, indentWithTab, standardKeymap } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { indentUnit } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { keymap, EditorView, placeholder } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { yCollab } from 'y-codemirror.next';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import { customEditorTheme } from '@/styles/theme';
import { userColor } from '@/utils/userTagColors';

interface Props {
  provider: WebsocketProvider | null;
  ytext: Y.Text;
  setYtext: (ytext: Y.Text) => void;
  viewer: string;
  nickname: string;
  handleProvider: (pro: WebsocketProvider) => void;
  ableToEdit: boolean;
}

const EditorCodeMirror: React.FC<Props> = ({
  viewer,
  ytext,
  nickname,
  provider,
  setYtext,
  handleProvider,
  ableToEdit,
}) => {
  const editor = useRef(null);

  useEffect(() => {
    if (!viewer) return;

    if (provider) {
      provider.disconnect();
    }

    const newDoc = new Y.Doc();
    // const newProvider = new WebsocketProvider('ws://52.69.242.42:8000', viewer, newDoc);
    const newProvider = new WebsocketProvider('ws://localhost:8000', viewer, newDoc);
    setYtext(newDoc.getText('codemirror'));
    handleProvider(newProvider);
  }, [viewer]);

  useEffect(() => {
    if (!ytext) return;

    provider?.awareness.setLocalStateField('user', {
      name: nickname,
      color: userColor.color,
      colorLight: userColor.light,
      roomName: viewer,
      clientID: provider.awareness.clientID,
    });

    const editorPlaceHolder = `print("welcome to coding learn")`;

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        customEditorTheme,
        python(),
        yCollab(ytext, provider.awareness),
        keymap.of([indentWithTab]),
        keymap.of(standardKeymap),
        keymap.of(defaultKeymap),
        indentUnit.of('\t'),
        placeholder(editorPlaceHolder),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ contenteditable: ableToEdit ? 'false' : 'true' }),
      ],
    });

    const view = new EditorView({
      state: state,
      parent: editor.current || undefined,
    });

    return () => {
      view?.destroy();
    };
  }, [provider]);

  return (
    <Container>
      <div
        className='codemirror-editor'
        ref={editor}
        style={{
          filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)',
          marginBottom: '10px',
          fontSize: '2rem',
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  .codemirror-editor .cm-ySelectionInfo {
    opacity: 1;
  }
`;

export default EditorCodeMirror;
