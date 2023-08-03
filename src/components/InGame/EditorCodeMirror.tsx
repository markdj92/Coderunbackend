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
  provider?: WebsocketProvider;
  handleProvider?: (provider: WebsocketProvider) => void;
  title: string;
  viewer: string;
  setViewer: (viewer: string) => void;
  nickname: string;
  isSubmit: boolean;
}

const EditorCodeMirror: React.FC<Props> = ({ viewer, nickname, isSubmit }) => {
  const editor = useRef(null);

  const ydoc = useRef(new Y.Doc());
  const provider = useRef<WebsocketProvider | null>(null);

  const ytext = ydoc.current.getText('codemirror');

  useEffect(() => {
    ydoc.current.getText('codemirror').delete(0, ydoc.current.getText('codemirror').length);
  }, [viewer]);

  useEffect(() => {
    provider.current = new WebsocketProvider('ws://52.69.242.42:8000', viewer, ydoc.current);

    provider.current?.awareness.setLocalStateField('user', {
      name: nickname,
      color: userColor.color,
      colorLight: userColor.light,
      roomName: viewer,
      clientID: provider.current.awareness.clientID,
    });

    const editorPlaceHolder = `print("welcome to coding learn")`;

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        python(),
        yCollab(ytext, provider.current.awareness),
        keymap.of([...yUndoManagerKeymap, indentWithTab]),
        keymap.of(standardKeymap),
        keymap.of(defaultKeymap),
        indentUnit.of('\t'),
        foldGutter(),
        placeholder(editorPlaceHolder),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ contenteditable: isSubmit ? 'true' : 'true' }),
      ],
    });

    const view = new EditorView({
      state: state,
      parent: editor.current || undefined,
    });

    return () => {
      view?.destroy();
      provider.current?.destroy();
    };
  }, [viewer]);

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
