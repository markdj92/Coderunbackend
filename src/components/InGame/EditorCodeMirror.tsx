//@ts-nocheck
import { defaultKeymap, indentWithTab, standardKeymap } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { indentUnit, foldGutter } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { keymap, EditorView, placeholder } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import { userColor } from '@/utils/userTagColors';

interface Props {
  provider: WebsocketProvider | null;
  ytext: Y.Text;
  setYtext: (ytext: Y.Text) => void;
  viewer: string;
  nickname: string;
  handleProvider: (pro: WebsocketProvider) => void;
  isSubmit: boolean;
}

const EditorCodeMirror: React.FC<Props> = ({
  viewer,
  ytext,
  nickname,
  isSubmit,
  provider,
  setYtext,
  handleProvider,
}) => {
  const editor = useRef(null);

  useEffect(() => {
    if (!viewer) return;

    if (provider) {
      provider.disconnect();
    }

    const newDoc = new Y.Doc();
    const newProvider = new WebsocketProvider('ws://52.69.242.42:8000', viewer, newDoc);
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
        python(),
        yCollab(ytext, provider.awareness),
        keymap.of([...yUndoManagerKeymap, indentWithTab]),
        keymap.of(standardKeymap),
        keymap.of(defaultKeymap),
        indentUnit.of('\t'),
        foldGutter(),
        placeholder(editorPlaceHolder),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ contenteditable: isSubmit ? 'false' : 'true' }),
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
    <div>
      <div
        className='codemirror-editor'
        ref={editor}
        style={{
          filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)',
          marginBottom: '10px',
        }}
      />
    </div>
  );
};

export default EditorCodeMirror;